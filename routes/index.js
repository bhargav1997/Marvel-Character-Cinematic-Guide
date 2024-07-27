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

      if (!moviesResponse.data.Search) {
         return res.render("character", { character: null, movies: [] });
      }

      const movies = moviesResponse.data.Search.map(async (movie) => {
         const movieDetailsResponse = await axios.get(`http://www.omdbapi.com/`, {
            params: {
               i: movie.imdbID,
               apikey: OMDB_API_KEY,
            },
         });
         return movieDetailsResponse.data;
      });

      const moviesDetails = await Promise.all(movies);

      console.log("Movies Details:", moviesDetails[0].Ratings);

      res.render("character", { character, movies: moviesDetails });
   } catch (error) {
      console.error(error);
      res.redirect("/");
   }
});

router.get("/favorites", (req, res) => {
   res.render("favorites");
});

module.exports = router;
