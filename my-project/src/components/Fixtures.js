import React from 'react'
import {Fragment, useState, useEffect} from 'react'
import { Listbox, Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Select, { AriaOnFocus } from 'react-select';
import seasons from './Seasons';
import axios from 'axios';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


const Fixtures = ({league, season, team}) => {

  const [query, setQuery] = useState('')
  const [fetchedGames, setFetchedGames] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState({name: 1});
  const [currentRound, setCurrentRound] = useState("1");
  const [teamFixture, setTeamFixture] = useState({
          home: '',
          away: '',
          homelogo: '',
          awaylogo: '',
          date: '',
          homescore: '',
          awayscore: '',
          time: ''
  });

    useEffect(() => {
      fetchCurrentRound();
      fetchRounds();
    },[league, season])

   useEffect(()=>{
      fetchFixtures();
   },[rounds, selectedRound, league, season, team])

    const fetchCurrentRound = async() => {
      try {
        const response = await axios.request(optionsCurrentRound);
        if(response.data.response.length === 0){
          setCurrentRound({name: selectedRound.name})  
        } else {
          if(league.type==='League')
            setCurrentRound(response.data.response[0].split("- ")[1]);
          else
            setCurrentRound(response.data.response[0]);
        }
        console.log(currentRound)
      } catch (error) {
        console.error(error);
      }
    }

  const options = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures/rounds',
    params: {league: league.id, season: season.name},
    headers: {
      'X-RapidAPI-Key': 'c969b4607amsh3cb2df02552da08p190018jsnf6aaa62e7900',
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
  };

  const optionsCurrentRound = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures/rounds',
    params: {
      league: league.id,
      season: season.name,
      current: 'true'
    },
    headers: {
      'X-RapidAPI-Key': 'c969b4607amsh3cb2df02552da08p190018jsnf6aaa62e7900',
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
  };

  const optionsFixtures = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
    params: {league: league.id, season: season.name, round: 'Regular Season - ' + selectedRound.name},
    headers: {
      'X-RapidAPI-Key': 'c969b4607amsh3cb2df02552da08p190018jsnf6aaa62e7900',
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
  };

  const fetchFixtures=() => {
    axios.request(optionsFixtures).then(function (response) {
      console.log(response.data);
      const transformedResponse = response.data.response.map(eachFixture=>{
        return {
          home: eachFixture.teams.home.name,
          away: eachFixture.teams.away.name,
          homelogo: eachFixture.teams.home.logo,
          awaylogo: eachFixture.teams.away.logo,
          date: eachFixture.fixture.date.split('T')[0],
          homescore: eachFixture.score.fulltime.home,
          awayscore: eachFixture.score.fulltime.away,
          time: eachFixture.fixture.date.split('T')[1].split('+')[0]
        }
      });
      setFetchedGames(transformedResponse);
      if(team.name!==''){
        const favoriteTeamFixture = transformedResponse.filter((eachFixture) =>{
          return eachFixture.home === team.name || eachFixture.away === team.name
       })
       if(favoriteTeamFixture.length!=0){
        setTeamFixture(favoriteTeamFixture[0])
       }
      }
    }).catch(function (error) {
      console.error(error);
    });
   }

   const fetchRounds = () => {
    axios.request(options).then(function (response) {
      console.log(response.data.response);
      // split the string 'Regular Season - 1' to '1'
      const splittedRounds = response.data.response.map(eachRound=>{
        if(eachRound.includes('Regular Season')){
          const splittedArray = eachRound.split("- ");
          return splittedArray[1];
        } else {
          return eachRound;
        }
      });
      const roundsObjects = splittedRounds.map(eachRound => {
        return {
          name: eachRound
        }
      })
      console.log(roundsObjects);
      setRounds(roundsObjects);
    }).catch(function (error) {
      console.error(error);
    });
   }

  return (
    <div>
      <div className='mt-4 mb-7 flex justify-center'>
          <Combobox className='z-0' value={selectedRound} onChange={setSelectedRound}>
            <div className="relative mt-3">
              <div className="relative w-96 h-14 cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 xl:text-xl">
                <Combobox.Input
                  displayValue={(selectedRound) => selectedRound.name}
                  className="w-full border-none py-2 pl-3 pr-10 text-xl text-gray-900 focus:ring-0"
                  onChange={(event) => setQuery(event.target.value)}
                />
                <Combobox.Button className="absolute border-lef border-blue-950 inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-8 w-20 text-blue-950 "
                    aria-hidden="true"
                  />
                </Combobox.Button>
              </div>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery('')}
              >
                <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none xl:text-xl">
                {rounds.length === 0 && query !== '' ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      Choose a valid league or season from the input field above!
                    </div>
                  ) : (
                    rounds.map(eachRound => (
                      <Combobox.Option
                        key={eachRound.name}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-blue-950 text-white' : 'text-gray-900'
                          }`
                        }
                        value={eachRound}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {eachRound.name}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? 'text-white' : 'text-blue-950'
                                }`}
                              >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        </div> 
      <div className='flex flex-col justify-center items-center mb-8'>
        {team.name==''?
         <h1>x</h1> :
         <div className='flex flex-col justify-center items-center'>
            <h1 className='mt-10 mb-3 text-center text-3xl'> {team.name}'s fixture of the {league.value} ({selectedRound.name}/{season.name}) </h1>
            <div id='fixture' className='w-[700px] max-w-[100%] flex flex-col text-3xl border mt-3 bg-slate-50 rounded-md'>
              <div className='flex justify-center mt-6'>
                    <img 
                      src={teamFixture.homelogo}
                      alt="club logo of home team"
                      aria-hidden="true"
                      className='w-10 mr-1'
                    >
                    </img>
                    <span className='w-64 max-w-[100%]'>{teamFixture.home}</span>
                    <div className='bg-black text-white w-10 text-center mx-1'>
                      {teamFixture.homescore}
                    </div>
                    <div className='bg-black text-white w-10 text-center mx-1'>
                    {teamFixture.awayscore}
                    </div>
                    <span className='w-64 max-w-[100%] text-right'>{teamFixture.away}</span>
                    <img 
                      src={teamFixture.awaylogo}
                      aria-hidden="true"
                      alt="club logo of away team"
                      className='w-10 ml-1'
                    >
                    </img> 
                </div>
                <span className='self-center mt-4 text-xl'>
                  {teamFixture.date} {teamFixture.time}
                </span>
                </div>
              </div>
        } 
        
        <h1 className='mt-10 mb-10 text-center text-3xl'> All fixtures of the {league.value} ({selectedRound.name}/{season.name}) </h1> 
        {
          fetchedGames.map((element,index)=>{
            return (
              <div id='fixture' className='w-[700px] max-w-[100%] flex flex-col text-3xl border mt-3 bg-slate-50 rounded-md'>
                <div className='flex justify-center mt-6'>
                    <img 
                      src={element.homelogo}
                      alt="club logo of home team"
                      aria-hidden="true"
                      className='w-10 mr-1'
                    >
                    </img>
                    <span className='w-64 max-w-[100%]'>{element.home}</span>
                    <div className='bg-black text-white w-10 text-center mx-1'>
                      {element.homescore}
                    </div>
                    <div className='bg-black text-white w-10 text-center mx-1'>
                    {element.awayscore}
                    </div>
                    <span className='w-64 max-w-[100%] text-right'>{element.away}</span>
                    <img 
                      src={element.awaylogo}
                      aria-hidden="true"
                      alt="club logo of away team"
                      className='w-10 ml-1'
                    >
                    </img> 
                </div>
                <span className='self-center mt-4 text-xl'>
                  {element.date} {element.time}
                </span>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Fixtures