const { Router } = require("express");

const httpError = require("../utils/httpError");
const { addMusicians, deleteAllMusicians } = require("../managers/musician");
const { addInstruments, deleteAllInstruments } = require("../managers/instrument");
const { addSymphonies, deleteAllSymphonyIds } = require("../managers/symphony");
const { addOrchestries, deleteAllOrchestries } = require("../managers/orchestra");
const { addLocations, deleteAllLocations } = require("../managers/location");
const { addConcerts, addConcertTags, deleteAllConcertTags } = require("../managers/concert");
const {
  addPerformances,
  deleteAllConcertPerformances,
  deleteAllSoloistPerformances,
} = require("../managers/performance");
const { csvTestFilePath } = require("../utils/config");
const { csvRowsToObjects } = require("../utils/csvRead");

const csvFilePath = csvTestFilePath;

const controller = Router();

// Describe
// Seed database from stratch with CSV data
controller.post("/seed", async (req, res, next) => {
  try {
    // Delete existing data
    Promise.all([
      await deleteAllConcertPerformances(),
      await deleteAllSoloistPerformances(),
      await deleteAllMusicians(),
      await deleteAllInstruments(),
      await deleteAllSymphonyIds(),
      await deleteAllOrchestries(),
      await deleteAllLocations(),
      await deleteAllConcertTags(),
    ]);

    // Read CSV file
    const path = csvFilePath;
    const rowObjects = await csvRowsToObjects(path);

    // Collect musicians from conductors
    let musicians = [];

    rowObjects.map((x) => {
      const conductor = x.Kapellimestari.trim();

      if (conductor !== "" && !musicians.includes(conductor)) {
        musicians.push(conductor);
      }
    });

    // Collect musicians from compositors
    rowObjects.map((x) => {
      const compositor = x.Saveltaja.trim();

      // Check for 'empty'
      const regex1 = new RegExp("\\*");

      if (regex1.test(compositor) || compositor === "") {
        return;
      }

      // Check for multiple in one cell
      const regex2 = new RegExp("/");

      if (regex2.test(compositor)) {
        const compsArr = compositor.split("/").map((x) => x.trim());
        compsArr.map((x) => {
          const comp = x.trim();
          if (!musicians.includes(comp)) {
            musicians.push(comp);
            return;
          }
        });
      }

      if (!musicians.includes(compositor)) {
        musicians.push(compositor);
      }
    });

    // Collect musicians from arrangers
    rowObjects
      .filter((x) => x.Sovittaja.trim().length !== 0)
      .map((x) => {
        const current = x.Sovittaja;
        let arranger = current;

        // Filter string with regex
        const regex = new RegExp("^sov./arr.");

        if (regex.test(current)) {
          arranger = current.substring(9).trim();
        }

        if (!musicians.includes(arranger)) {
          musicians.push(arranger);
        }
      });

    // Collect instruments from soloists
    let instruments = [];

    // And collect musicians from soloist
    rowObjects
      .filter((x) => x.Solisti.trim().length !== 0)
      .map((x) => {
        const cell = x.Solisti;

        // Check for multiple in one cell
        const soloistArr = cell.split(",");
        soloistArr.map((x) => {
          const current = x.trim();

          // Get musicians
          const soloist = current.substring(0, current.indexOf("(")).trim();
          if (soloist.length > 0 && !musicians.includes(soloist)) {
            musicians.push(soloist);
          }

          // Get instrument
          const regexInstrument = new RegExp("(w*)");

          if (regexInstrument.test(current)) {
            const start = current.indexOf("(") + 1;
            const end = current.indexOf(")");
            const instrument = current.substring(start, end).trim();

            if (instrument !== "" && !instruments.includes(instrument)) {
              instruments.push(instrument);
            }
          }
        });
      });

    // Collect symphony ids
    let symphonies = [];

    rowObjects.map((row) => {
      const symphonyIdCell = row.TeoksenId;
      const symphonyNameCell = row.TeoksenNimi;

      // Determine symphony name
      let symphonyName = symphonyNameCell;

      // Special concert cases
      const regexList = [
        /\(ylimääräinen\)/,
        /\(ke.\)/,
        /\(ekS.\)/,
        /\(ek Eurooppa.\)/,
        /\(tanssiversion ensiesitys\)/,
      ];

      if (regexList.some((rx) => rx.test(symphonyNameCell))) {
        const indexStart = symphonyNameCell.lastIndexOf("(");
        const indexEnd = symphonyNameCell.lastIndexOf(")");

        if (indexStart < indexEnd) {
          symphonyName = symphonyNameCell.substring(0, indexStart).trim();
        } else {
          console.log(
            "Something not right with brackets: ",
            indexStart,
            indexEnd,
            symphonyNameCell
          );
        }
      }

      const symphonyObj = {
        symphony_id: symphonyIdCell,
        name: symphonyName,
      };

      if (
        !symphonies.some(
          (x) => x.symphony_id === symphonyObj.symphony_id && x.name === symphonyObj.name
        )
      ) {
        symphonies.push(symphonyObj);
      }
    });

    // Collect orchestries
    let orchestraNames = [];

    rowObjects.map((row) => {
      const orchestra = row.Orkesteri;
      if (!orchestraNames.some((x) => x === orchestra) && orchestra.trim() !== "") {
        orchestraNames.push(orchestra);
      }
    });

    // Collect locations
    let locationNames = [];

    rowObjects.map((row) => {
      const location = row.Konserttipaikka;
      if (!locationNames.some((x) => x === location) && location.trim() !== "") {
        locationNames.push(location);
      }
    });

    // Collect concert tags
    let concertTagNames = [];

    rowObjects.map((row) => {
      const tag = row.KonsertinNimike.trim();
      if (!concertTagNames.includes(tag) && tag !== "") {
        concertTagNames.push(tag);
      }
    });

    // Collect concerts
    let concerts = [];

    rowObjects.map((row) => {
      const concertId = row.KonserttiId.trim();
      const date = row.Paivamaara.trim();
      const time = row.Aloitusaika.trim();
      const location = row.Konserttipaikka.trim();
      const tag = row.KonsertinNimike.trim();
      const orchestra = row.Orkesteri.trim();

      if (!concerts.some((x) => x.concert_id === concertId) && concertId !== "") {
        const concertObject = {
          concert_id: concertId,
          date: date,
          starting_time: time,
          location: location,
          concert_tag: tag,
          orchestra: orchestra,
        };
        concerts.push(concertObject);
      }
    });

    // Collect both soloist and concert performances
    let performances = [];

    rowObjects.map((row) => {
      const soloistPerformances = [];
      const soloistsCell = row.Solisti;

      // Check for multiple soloists in one cell
      const soloistArr = soloistsCell.split(",");
      soloistArr.map((x) => {
        const current = x.trim();

        let soloistTemp;
        let instrumentTemp;

        // Get musicians
        const soloist = current.substring(0, current.indexOf("(")).trim();

        if (soloist.length > 0) {
          soloistTemp = soloist;
        }

        // Get instrument
        const regexInstrument = new RegExp("(w*)");

        if (regexInstrument.test(current)) {
          const start = current.indexOf("(") + 1;
          const end = current.indexOf(")");
          const instrument = current.substring(start, end).trim();

          if (instrument.length > 0) {
            instrumentTemp = instrument;
          }
        }

        // Add new soloist performance for current concert performance
        if (soloistTemp && instrumentTemp) {
          soloistPerformances.push({
            soloistName: soloistTemp,
            instrumentName: instrumentTemp,
          });
        }
      });

      // Initialize defaults
      let newPerformance = {
        is_encore: false,
        premiere_in_finland: false,
        world_premiere: false,
        premiere_in_europe: false,
        premiere_dance_performance: false,
      };

      // Check for special case concert performance
      const symphonyNameCell = row.TeoksenNimi.trim();

      // Encore
      if (symphonyNameCell.match(/\(ylimääräinen\)/)) {
        newPerformance.is_encore = true;
      }
      // Finland premiere
      if (symphonyNameCell.match(/\(ekS.\)/)) {
        newPerformance.premiere_in_finland = true;
      }
      // World premiere
      if (symphonyNameCell.match(/\(ke.\)/)) {
        newPerformance.world_premiere = true;
      }
      // Europe premiere
      if (symphonyNameCell.match(/\(ek Eurooppa\)/)) {
        newPerformance.premiere_in_europe = true;
      }
      // Dance premiere, wtf?
      if (symphonyNameCell.match(/\(tanssiversion ensiesitys\)/)) {
        newPerformance.premiere_dance_performance = true;
      }

      // Arranger regex
      let arranger = row.Sovittaja.trim();
      const regex = new RegExp("^sov./arr.");

      if (regex.test(arranger)) {
        arranger = arranger.substring(9).trim();
      }

      // Build concert performance object from the rest
      const concertId = row.KonserttiId.trim();
      const order = row.Esitysjarjestys.trim();
      const symphonyId = row.TeoksenId.trim();
      const conductor = row.Kapellimestari.trim();
      const compositor = row.Saveltaja.trim();

      newPerformance = {
        ...newPerformance,
        order: order,
        concertId: concertId,
        symphonyId: symphonyId,
        conductor: conductor,
        compositor: compositor,
        arranger: arranger,
        soloist_performances: soloistPerformances,
      };

      if (!performances.some((x) => x === newPerformance)) {
        performances.push(newPerformance);
      }
    });

    // throw "Debug stop";

    // Save all 'loosely' collected
    console.log("Saving 'loose' tables...");
    Promise.all([
      await addMusicians(musicians),
      await addSymphonies(symphonies),
      await addInstruments(instruments),
      await addOrchestries(orchestraNames),
      await addLocations(locationNames),
      await addConcertTags(concertTagNames),
    ]);

    // Save concerts
    await addConcerts(concerts);

    // Save soloist and concert performances
    const savedCount = await addPerformances(performances);

    console.log({ savedPerformances: savedCount });
    return res.send({ savedPerformances: savedCount });
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
  }
});

module.exports = controller;
