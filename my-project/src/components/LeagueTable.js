import React from 'react'
import { useState, useEffect} from 'react'
import axios from 'axios'
import './standings.css';


// table from https://bbbootstrap.com/snippets/team-points-table-61285186

const LeagueTable = ({league, season}) => {


    const [teams, setTeams] = useState([]);
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const options = {
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/standings',
      params: {season: season.name, league: league.id},
      headers: {
        'X-RapidAPI-Key': 'c969b4607amsh3cb2df02552da08p190018jsnf6aaa62e7900',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
    };

     function fetchTableData () {
      axios.request(options).then(function (response) {
        console.log(response.data)
        setTeams(response.data.response[0].league.standings[0]);
      }).catch(function (error) {
        console.error(error);
      });
     }

     useEffect(() => {
      fetchTableData();
     },[season,league])


  return (
    <div>
      <h1 className='mt-3 mb-5 text-center text-3xl'> {league.value} standings in {season.name}</h1>
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
                        {
                        teams.map((element, index) => {
                              return (
                                 <tr>
                                    <td>{element.rank}</td>
                                    <th scope='row'> {element.team.name}</th>
                                    <td>{element.all.played}</td>
                                    <td>{element.all.win}</td>
                                    <td>{element.all.draw}</td>
                                    <td>{element.all.lose}</td>
                                    <td>{element.all.goals.for}</td>
                                    <td>{element.all.goals.against}</td>
                                    <td>{element.goalsDiff}</td>
                                    <td>{element.points}</td>
                                 </tr>
                              )
                        })
                        }
                        </tbody>
                  </table>
               </div>
            </div>
         </div>
      </section>
    </div>
  )
}

export default LeagueTable