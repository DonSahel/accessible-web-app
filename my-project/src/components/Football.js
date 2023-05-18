import React, { CSSProperties } from 'react';
import { Tab } from '@headlessui/react'
import { Fragment, useState, useEffect} from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import LeagueTable from './LeagueTable';
import CupTable from './CupTable';
import Stats from './Stats'
import Fixtures from './Fixtures'
import axios from 'axios'
import seasons from './Seasons';
import Standings from './Standings';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Football = () => {

  const [selectedLeague, setSelectedLeague] = useState({
    name: 'Premier League - England',
    value: 'Premier League',
    id: 39,
    type: 'League',
    seasons: [
      {name: 2022},
      {name: 2021},
      {name: 2020},
      {name: 2018},
      {name: 2017},
      {name: 2016},
      {name: 2015},
      {name: 2014},
      {name: 2013},
      {name: 2012},
      {name: 2011},
      {name: 2010}
    ]
  })
  const [selectedSeason, setSelectedSeason] = useState(selectedLeague.seasons[0]);
  const [selectedTeam, setSelectedTeam] = useState({name:''})
  const [fetchedTeams, setFetchedTeams] = useState([])
  const [fetchedLeagues, setFetchedLeagues] = useState([])
  const [query, setQuery] = useState('')

  const filteredLeagues =
    query === ''
      ? fetchedLeagues
      : fetchedLeagues.filter((eachLeague) =>
          eachLeague.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  useEffect(() => {  
     fetchAvailableCompetitions();
     fetchTeams();
   },[])

   useEffect(() => {
    console.log('changed league or season input')
    setSelectedTeam('')  
    fetchTeams();
  },[selectedLeague, selectedSeason])

  const optionsTeams = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/teams',
    params: {
      league: selectedLeague.id,
      season: selectedSeason.name
    },
    headers: {
      'X-RapidAPI-Key': 'c969b4607amsh3cb2df02552da08p190018jsnf6aaa62e7900',
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
  };

  const options = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/leagues',
    headers: {
      'X-RapidAPI-Key': 'c969b4607amsh3cb2df02552da08p190018jsnf6aaa62e7900',
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
  };

  const fetchTeams = async() => {
    try {
      const response = await axios.request(optionsTeams);
      const allTeams = response.data.response.map(eachTeam => {
        return {
          name: eachTeam.team.name,
          id: eachTeam.team.id
        }
      })
      setFetchedTeams(allTeams)
      console.log(allTeams)
    } catch (error) {
      console.error(error);
    }
  }

   const fetchAvailableCompetitions = () => { 
    axios.request(options).then(function (response) {
      console.log(response.data);
      saveFetchedLeagues(response.data.response);
    }).catch(function (error) {
      console.error(error);
    });
   }

   const saveFetchedLeagues=(arrayOfLeagues)=>{
    const newLeagues = arrayOfLeagues.map(eachLeague=> {
      return {
        name: eachLeague.league.name + ' - ' + eachLeague.country.name,
        value: eachLeague.league.name,
        id: eachLeague.league.id,
        type: eachLeague.league.type,
        seasons: eachLeague.seasons.map(eachSeason => {
          return{
          name: eachSeason.year,
          value: eachSeason.year
          }
        }
        )
      };
    });
    console.log('NEW');
    console.log(newLeagues);
    setFetchedLeagues(newLeagues);
   }

  return (
    <div>
      <div className='flex flex-col items-center justify-evenly'>
        <div className='mt-3'>
          <Combobox className='z-30' value={selectedLeague} onChange={setSelectedLeague}>
            <div className="relative mt-3">
              <div className="relative w-96 h-14 cursor-default overflow-hidden rounded-lg bg-white text-left shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 xl:text-xl">
                <Combobox.Input
                  className="w-full border-none py-2 pl-3 pr-10 text-xl text-gray-900 focus:ring-0"
                  displayValue={(eachLeague) => eachLeague.name}
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
                  {filteredLeagues.length === 0 && query !== '' ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      Nothing found.
                    </div>
                  ) : (
                    filteredLeagues.map((person) => (
                      <Combobox.Option
                        key={person.id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-blue-950 text-white' : 'text-gray-900'
                          }`
                        }
                        value={person}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {person.name}
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
        <div className='mt-6'>
          <Combobox className='z-20' value={selectedSeason} onChange={setSelectedSeason}>
            <div className="relative mt-3">
              <div className="relative w-96 h-14 cursor-default overflow-hidden rounded-lg bg-white text-left shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 xl:text-xl">
                <Combobox.Input
                  displayValue={(eachSeason) => eachSeason.name}
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
                {selectedLeague.seasons.length === 0 && query !== '' ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      Choose a valid league from the input field above!
                    </div>
                  ) : (
                    selectedLeague.seasons.map(eachSeason => (
                      <Combobox.Option
                        key={eachSeason.name}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-blue-950 text-white' : 'text-gray-900'
                          }`
                        }
                        value={eachSeason}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {eachSeason.name}
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
        <div className='mt-6'>
          <Combobox className='z-10' value={selectedTeam} onChange={setSelectedTeam}>
            <div className="relative mt-3">
              <div className="relative w-96 h-14 cursor-default overflow-hidden rounded-lg bg-white text-left shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 xl:text-xl">
                <Combobox.Input
                  className="w-full border-none py-2 pl-3 pr-10 text-xl text-gray-900 focus:ring-0"
                  displayValue={(selectedTeam) => selectedTeam.name}
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
                  {fetchedTeams.length === 0 && query !== '' ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      Nothing found.
                    </div>
                  ) : (
                    fetchedTeams.map((eachTeam) => (
                      <Combobox.Option
                        key={eachTeam.id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-blue-950 text-white' : 'text-gray-900'
                          }`
                        }
                        value={eachTeam}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {eachTeam.name}
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
      </div>
      <div className=" mt-6 items-center flex justify-center flex-col ">
        <Tab.Group>
          <Tab.List className=" flex space-x-3 w-3/4 rounded-xl bg-blue-950 p-1">
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-2xl font-medium text-black',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-800 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white shadow'
                      : 'text-blue-50 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                Standings
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-2xl font-medium leading-5 text-black',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-800 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white shadow'
                      : 'text-blue-50 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                Fixtures
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-2xl font-medium leading-5 text-black',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-800 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white shadow'
                      : 'text-blue-50 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                Statistics
              </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel>
              <Standings league={selectedLeague} season={selectedSeason} team={selectedTeam}/> 
            </Tab.Panel>
            <Tab.Panel>
              <Fixtures league={selectedLeague} season={selectedSeason} team={selectedTeam}/>
            </Tab.Panel>
            <Tab.Panel>
              <Stats/>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  )
}

export default Football