import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import RepoDetails from './RepoDetails';

function App() {

  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [repoDetails, setRepoDetails] = useState({});

  /* useEffect runs on-load and monitors state change on provided field (in this case 'userName'), 
    with any change of 'userName', useEffect will reset related variables. */
  useEffect(() => {
    setRepos([]); /* reset to empty array */
    setRepoDetails({}); /* reset to empty object */
  }, [userName]);

  function handleSubmit(e) {
    e.preventDefault();

    searchRepository();
  }

  function searchRepository() {
    setLoading(true);

    axios({
      method: "get",
      url: `https://api.github.com/users/${userName}/repos`
    }).then(res => {
      setLoading(false);
      setRepos(res.data);
    }).catch(error => {
      console.log("Exception while calling Github" + error)
      setLoading(false);
    });

  }

  function renderRepoDetails(repo) {
    return(
      <div className='row' key={repo.id} onClick={() => loadRepoDetails(repo.name)}>
        <h2 className='repo-name'>
          {repo.name}
        </h2>
      </div>
    );
  }

  function loadRepoDetails(repoName) {
    setDetailsLoading(true);

    axios( {
      method: "get",
      url: `http://api.github.com/repos/${userName}/${repoName}`
    }).then(response => {
      setDetailsLoading(false);
      setRepoDetails(response.data);
    })
  }

  return (
    <div className="App">
      <div className="landing-page-container">
          <div className="left-side">
            <form className='form'>
              <input className="input" 
              value={userName}
              placeholder="Github Username"
              onChange={e => setUserName(e.target.value)}
              />

              <button className="button" onClick={handleSubmit}>{loading ? "Loading...":"Search"}</button>
            </form>

            <div className='results-container'>
              {repos.map(renderRepoDetails)}
            </div>
          </div>
          <RepoDetails details={repoDetails} loading={detailsLoading} />
      </div>

    </div>
  );
}

export default App;
