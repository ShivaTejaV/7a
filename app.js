const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

let app = express();
app.use(express.json());

const filepath = path.join(__dirname, "cricketMatchDetails.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: filepath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(error);
  }
};

initializeDBAndServer();

function convertToJson(item) {
  temp = {
    playerId: item.player_id,
    playerName: item.player_name,
  };
  return temp;
}

//API 1
app.get("/players/", async (request, response) => {
  const q1 = `
        SELECT *
        FROM player_details;`;
  const dbResponse = await db.all(q1);
  let ans = [];
  for (let item of dbResponse) {
    ans.push(convertToJson(item));
  }
  response.send(ans);
});

//API 2

app.get("/players/:playerId/", async (request, response) => {
  const id = parseInt(request.params.playerId);
  const q2 = `
        SELECT *
        FROM player_details
        WHERE player_id = ${id};`;
  const dbResponse = await db.get(q2);
  response.send(convertToJson(dbResponse));
});

//API 3

app.put("/players/:playerId/", async (request, response) => {
  const id = parseInt(request.params.playerId);
  const { playerName } = request.body;
  console.log(id, playerName);
  const q3 = `
    UPDATE 
        player_details
    SET 
        player_name = "${playerName}"
    WHERE 
        player_id = ${id};`;

  await db.run(q3);
  response.send("Player Details Updated");
});

//API 4

app.get("/matches/:matchId/", async (Request, response) => {
  const id = parseInt(request.params.matchId);
  const q4 = `
    SELECT *
    FROM match_details
    WHERE match_id = ${id};`;
  const dbResponse = await db.get(q4);
  const temp = {
    matchId: dbResponse.match_id,
    match: dbResponse.match,
    year: dbResponse.year,
  };
  console.log(temp);
  response.send(temp);
});

//API 5

//API 6

//API 7

module.exports = app;
