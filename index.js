import express from "express";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

let app = express();

let port = 3000;

let __fileName = fileURLToPath(import.meta.url);
let __dirName = path.dirname(__fileName);

// Middleware for accessing request body
app.use(express.urlencoded({ extended: true }));

// Set up assets folder
app.use(express.static("public"));

// Set up templating engine
app.set("views", "./views");
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.send("Ok");
});

app.post("/", (req, res) => {
  let name = req.body.name;
  let message = req.body.message;

  console.log({ name, message });

  let transporter = nodemailer.createTransport({
    // service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "brayomwas95@gmail.com",
      pass: "bgyi otsx lcir rmcq",
    },
  });

  transporter.sendMail(
    {
      from: "brayomwas95@gmail.com",
      to: "thedevbrian@gmail.com",
      subject: "Hello",
      text: `${message}`,
    },
    (error, info) => {
      if (error) {
        return console.log("Error sending email:", error);
      }
      console.log("Email sent:", info.response);
    }
  );

  res.redirect("/");
});

app.get("/breweries", async (req, res) => {
  // Get the query / search params from the url
  let query = req.query;
  let city = query.by_city;

  //   If there is a search query,return filtered results, else return all breweries

  // Filter by city

  let breweries;

  if (city) {
    let breweriesRes = await fetch(
      `https://api.openbrewerydb.org/v1/breweries?by_city=${city}`
    );
    breweries = await breweriesRes.json();

    // Handle not found
    if (breweries.length === 0) {
      //   return res.status(404).json({ error: "City not found!" });
      return res.render("error", { message: "City not found!" });
    }
  } else {
    let breweriesRes = await fetch(
      `https://api.openbrewerydb.org/v1/breweries`
    );
    breweries = await breweriesRes.json();
  }

  // console.log({ breweries });
  res.render("breweries", { breweries });
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirName, "public", "contact.html"));
});

app.post("/contact", (req, res) => {
  // Get submitted values from the request body
  let body = req.body;

  let name = body.name;
  let email = body.email;
  let message = body.message;

  console.log({ name, email, message });

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "brayomwas95@gmail.com",
      pass: "ymzm rstj rkmh tivp",
    },
  });

  transporter.sendMail(
    {
      from: "brayomwas95@gmail.com",
      to: "mwangib041@gmail.com",
      subject: "Contact from the breweries website",
      text: `Name: ${name}, Email: ${email}, Message: ${message}`,
    },
    (error, info) => {
      if (error) {
        console.log(error);
      }
      console.log(`Email sent ${info.response}`);
    }
  );

  //   TODO: Build success page
  res.redirect("/success");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
