import { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/get?page=${page}`, {});

      if (res.data.filtered) {
        setData(res.data.filtered);
        setHasMore(res.data.hasMore);
      } else {
        console.log("No data found");
        setData([]);
      }
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Filtered Data</h1>
      {data.length > 0 ? (
        <ul>
          {data.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      ) : (
        <p>No results</p>
      )}
      <div>
        {page > 1 && <button onClick={() => setPage(page - 1)}>Prev</button>}
        {hasMore && <button onClick={() => setPage(page + 1)}>Next</button>}
      </div>
    </div>
  );
};

export default App;
