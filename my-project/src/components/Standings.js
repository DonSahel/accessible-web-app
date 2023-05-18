import React, { useEffect } from 'react'
import LeagueTable from './LeagueTable';
import CupTable from './CupTable';
import {useState} from 'react'
import axios from 'axios'
import './standings.css';



const Standings = ({league, season, team}) => {
  
  const [currentPosition, setCurrentPosition] = useState([])

  const options = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/standings',
    params: {
      season: season.name,
      league: league.id,
      team: team.id
    },
    headers: {
      'X-RapidAPI-Key': 'c969b4607amsh3cb2df02552da08p190018jsnf6aaa62e7900',
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
  };
  
  const fetchedTeamPosition =  async() => {
    try {
      const response = await axios.request(options);
      console.log(response.data);
      const restData = response.data.response[0].league.standings[0][0];
      const currentPositionObject = {
        rank: restData.rank,
        name: restData.team.name,
        played: restData.all.played,
        wins: restData.all.win,
        draws: restData.all.draw,
        losses: restData.all.lose,
        goalsFor: restData.all.goals.for,
        goalsAgainst: restData.all.goals.against,
        goalsDiff: restData.goalsDiff,
        points: restData.points
      }
      setCurrentPosition(currentPositionObject)
      console.log(currentPositionObject)
    } catch (error) {
      console.error(error);
    }
  } 

  useEffect(() => {
    fetchedTeamPosition();
  },[team])

  return (
    <div>
        <div>
            <h1 className='mt-10 mb-3 text-center text-3xl'> {team.name}'s position in {league.value}</h1>
            <section class="content-info">
              <div class="container paddings-mini">
                  <div class="row">
                    <div class="col-lg-12">
                        <table class="table-striped table-responsive table-hover result-point">
                              <tbody> 
                                <tr>
                                    <th title='postion' scope='col' class="text-left">Position</th>
                                    <th scope='col' class="text-left">TEAM</th>
                                    <th scope='col' title='Points' class="text-center">Games played</th>
                                    <th scope='col' title='Wins' class="text-center">Wins</th>
                                    <th scope='col' title='Draws' class="text-center">Draws</th>
                                    <th scope='col' title='Losses' class="text-center">Losses</th>
                                    <th scope='col' title='Goals scored' class="text-center">Goals for</th>
                                    <th scope='col' title='Goals achieved' class="text-center">Goals against</th>
                                    <th scope='col' title='Goal difference' class="text-center">Goal difference</th>
                                    <th scope='col' title='Points' class="text-center">Points</th>
                                </tr>
                                <tr>
                                  <td>{currentPosition.rank}</td>
                                  <th scope='row'> {currentPosition.name}</th>
                                  <td>{currentPosition.played}</td>
                                  <td>{currentPosition.wins}</td>
                                  <td>{currentPosition.draws}</td>
                                  <td>{currentPosition.losses}</td>
                                  <td>{currentPosition.goalsFor}</td>
                                  <td>{currentPosition.goalsAgainst}</td>
                                  <td>{currentPosition.goalsDiff}</td>
                                  <td>{currentPosition.points}</td>
                                </tr>
                              </tbody>
                        </table>
                    </div>
                  </div>
              </div>
            </section>
        </div>
        <div>
            {league.type === 'League' 
                    ? <LeagueTable league={league} season={season}  />
                    : <CupTable league={league} season={season}/>
            }
        </div>
    </div>

  )
}

export default Standings