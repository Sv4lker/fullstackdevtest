import React, { useState, useEffect } from "react";
import axios from "axios";

export default function SearchBar(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const resp = await axios.post("/api/search", { searchTerm });
      setResults(resp.data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit">Искать</button>
    </form>
  );
}
