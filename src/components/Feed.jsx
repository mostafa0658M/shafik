import React, { useEffect, useState } from "react";
import { client } from "../client";
import { searchQuery, feedQuery } from "../utils/data";
import MasonryLayout from "./MasonryLayout.jsx";
import Spinner from "./Spinner";
import { useParams } from "react-router-dom";
const Feed = () => {
  const [loading, setLoading] = useState(true);
  const [pins, setPins] = useState();
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    if (categoryId) {
      const query = searchQuery(categoryId);
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  if (loading) {
    return <Spinner message='We are adding new ideas to your feed!' />;
  }
  if (!pins?.length) return <h2>No pins in this category.</h2>;
  return (
    <div>
      <MasonryLayout pins={pins} />
    </div>
  );
};

export default Feed;
