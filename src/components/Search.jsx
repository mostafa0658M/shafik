import React, { useEffect, useState } from "react";
import { client } from "../client";
import { feedQuery, searchQuery } from "../utils/data";
import { MasonryLayout, Spinner } from ".";

const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timeoutId = null;

    if (searchTerm !== "") {
      setLoading(true);

      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        const query = searchQuery(searchTerm);
        client.fetch(query).then((data) => {
          setPins(data);
          setLoading(false);
        });
      }, 750);
    } else {
      setLoading(true);
      const query = feedQuery;
      client
        .fetch(query)
        .then(setPins)
        .then(() => setLoading(false));
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  if (loading) return <Spinner message='Searching pins' />;
  if (pins?.length > 0) return <MasonryLayout pins={pins} />;
  if (pins?.length === 0 && searchTerm !== "" && !loading)
    return <p>No pins found</p>;
};

export default Search;
