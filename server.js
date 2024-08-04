const http = require('http');
const mysql = require('mysql2');
const url = require('url');
const cors = require('cors');

const port = 3000;

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "travel_rates"
});

con.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database successfully');
});

const handleRequest = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const destination = parsedUrl.pathname.substring(8); // Remove '/prices/' from the beginning

  if (parsedUrl.pathname.startsWith('/prices/')) {
    const query = "SELECT * FROM travel_rate WHERE place_name=?";
    const data = [destination];

    con.query(query, data, (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error retrieving prices');
        return;
      }

      if (result.length > 0) {
        console.log("Prices for", destination, "\n");
        const prices = result.map(row => ({
          car: row.car,
          bus: row.bus,
          flight: row.flight,
          train: row.train
        }));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(prices));
        console.log(prices);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`No prices found for ${destination}`);
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Endpoint not found');
  }
};  

const server = http.createServer((req, res) => {
  cors()(req, res, () => {
    handleRequest(req, res);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
