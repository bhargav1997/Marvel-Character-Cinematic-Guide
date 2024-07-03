const express = require("express");
const axios = require("axios");
const router = express.Router();
const crypto = require("crypto");

const MARVEL_PUBLIC_KEY = process.env.MARVEL_PUBLIC_KEY;
const MARVEL_PRIVATE_KEY = process.env.MARVEL_PRIVATE_KEY;
const OMDB_API_KEY = process.env.OMDB_API_KEY;

router.get("/", (req, res) => {
   res.render("index");
});

router.get("/character", async (req, res) => {
   const characterName = req.query.name;
   if (!characterName) {
      return res.redirect("/");
   }

   const ts = new Date().getTime();
   const hash = crypto
      .createHash("md5")
      .update(ts + MARVEL_PRIVATE_KEY + MARVEL_PUBLIC_KEY)
      .digest("hex");

   try {
      const marvelResponse = await axios.get(`https://gateway.marvel.com/v1/public/characters`, {
         params: {
            name: characterName,
            ts,
            apikey: MARVEL_PUBLIC_KEY,
            hash,
         },
      });

      const character = marvelResponse.data.data.results[0];

      const moviesResponse = await axios.get(`http://www.omdbapi.com/`, {
         params: {
            s: characterName,
            apikey: OMDB_API_KEY,
         },
      });

      const movies = moviesResponse.data.Search;

      res.render("character", { character, movies });
   } catch (error) {
      console.error(error);
      res.redirect("/");
   }
});

router.get("/favorites", (req, res) => {
   res.render("favorites");
});

module.exports = router;
