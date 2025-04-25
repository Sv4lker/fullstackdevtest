import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import axios from "axios";

export default function DataTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [startIndex, setStartIndex] = useState(0);

  async function fetchData() {
    try {
      setLoading(true);
      const response = await axios.get(`/api/data?startIndex=${startIndex}`);
      const newData = response.data;

      setData((prevData) => [...prevData, ...newData]);
      setStartIndex((prevIndex) => prevIndex + 20);
      setLoading(false);

      if (response.data.length === 0) {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchData(); // Первоначальная загрузка данных
  }, []);

  return (
    <div className="container">
      <h1>Список чисел</h1>
      <InfiniteScroll
        loadMore={fetchData}
        hasMore={hasMore}
        loader={<p key="loader">Загрузка...</p>}
      >
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
}
