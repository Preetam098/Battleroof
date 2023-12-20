import React, { useEffect, useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { BsCheck2Circle } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { FcApproval } from 'react-icons/fc'

import Layout from '../../layouts'
import Team from '../../assets/Team.gif'
import PlayButton from '../../components/PlayButton'
import DateFigure from '../../components/FomatDate'
import { tdmPlayersDetails, teamList } from '../../redux/actions/userAction'
import {
  settlementStatus,
  updateRoomId,
  viewTour,
} from '../../redux/actions/tournamentAction'
// import DeclareResult from "./DeclareResult";
import ButtonLoader from '../../components/ButtonLoader'
import ViewTeam from '../teams/ViewTeam'

const TdmPlayersDetails = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { state } = useLocation()

  const [roomDetails, setRoomDetails] = useState({})
  const [showDeclare, setShowDeclare] = useState(false)
  const [teamId, setTeamId] = useState()
  const { teams, tdmPlayerDetails, loading } = useSelector(
    (state) => state.userReducer,
  )
  const [playerListDetails, setPlayerListDetails] = useState({})
  const playerDetails = playerListDetails?.player
  const competitorDetails = playerListDetails?.competitor
  useEffect(() => {
    if (tdmPlayerDetails !== undefined) {
      setPlayerListDetails(tdmPlayerDetails)
    }
  }, [tdmPlayerDetails])

  const { viewtour } = useSelector((state) => state.tournamentReducer)
  const { result, imageUrl } = viewtour

  const statuss = useSelector((state) => state.userReducer)

  const [modals, setModals] = useState({
    confirmModal: false,
    activeTab: 'Overview',
    playersModal: false,
  })

  const handleOpenModal = (name) => {
    setModals({ ...modals, [name]: true })
  }

  const handleTabs = (value) => {
    setModals({ ...modals, activeTab: value ? value : 'upcoming' })
  }

  // Overview Data
  const overview = [
    {
      name: 'Name',
      value: playerDetails?.playerName,
    },
    {
      name: 'Game Status',
      value: playerDetails?.gameStatus,
    },
    {
      name: 'Bet Amount',
      value: `₹ ${playerDetails?.betAmount}`,
    },
    {
      name: 'Request Type',
      value: playerDetails?.requestType,
    },
    // {
    //   name: "Mode",
    //   value: result?.gameMode,
    // },

    // {
    //   name: "Starting Time",
    //   value: <DateFigure time={result?.startDateTime} />,
    // },
    // {
    //   name: "End Time",
    //   value: <DateFigure time={result?.endDateTime} />,
    // },
  ]

  // Overview Data
  const competitor = [
    {
      name: 'Name',
      value: competitorDetails?.name,
    },
    {
      name: 'Status',
      value: competitorDetails?.status ? 'True' : 'False',
    },
    {
      name: 'Rewarded Amount',
      value: `₹ ${competitorDetails?.rewaredAmount}`,
    },
    {
      name: 'Mobile Number',
      value: competitorDetails?.mobileNumber,
    },
    // {
    //   name: "Mode",
    //   value: result?.gameMode,
    // },

    // {
    //   name: "Starting Time",
    //   value: <DateFigure time={result?.startDateTime} />,
    // },
    // {
    //   name: "End Time",
    //   value: <DateFigure time={result?.endDateTime} />,
    // },
  ]

  const handleCloseModal = (name) => {
    setModals({ ...modals, [name]: false })
  }

  // handle settlement status
  const handleSettlement = () => {
    const payload = {
      tournamentId: state,
    }
    dispatch(settlementStatus(payload))
  }

  useEffect(() => {
    if (result) {
      const { roomPassword, roomId } = result
      setRoomDetails({ roomPassword, roomId })
    }
  }, [result])

  useEffect(() => {
    dispatch(tdmPlayersDetails(state?.query))
    // dispatch(teamList(`tournamentId=${state}`));
  }, [dispatch, state])

  // Handle Tabs
  const tabs = () => {
    switch (modals.activeTab) {
      case 'Overview':
        return (
          <>
            <div className="gap-4 md:gap-x-6 grid sm:grid-cols-2">
              {overview.map((item) => {
                return (
                  <div className="flex bg-gray-900 py-3 px-4 text-xs uppercase rounded-sm justify-between">
                    <span className="text-gray-400">{item.name}</span>
                    <span className="capitalize">{item.value}</span>
                  </div>
                )
              })}
            </div>
            {result?.winnings.length > 0 && (
              <table className="w-full capitalize my-5 sm:w-1/2">
                <thead className="text-sm text-left border-b text-gray-200">
                  <tr className="">
                    <td className="py-2">Ranks</td>
                    {result?.resultStatus == 1 && (
                      <td className="py-2">Teams</td>
                    )}
                    <td className="py-2">Prizes</td>
                  </tr>
                </thead>
                <tbody className="text-left">
                  {result?.winnings?.map((item) => {
                    const all = teams?.results?.map((it) => {
                      return it.rank === item.rank && it.name
                    })
                    return (
                      <tr key={item.rank} className="text-xs text-gray-200">
                        <td className="py-2">#{item.rank}</td>
                        {result?.resultStatus == 1 && (
                          <td className="py-2 capitalize">
                            {all?.map((val) => (
                              <p key={val}>{val}</p>
                            ))}
                          </td>
                        )}
                        <td className="py-2 text-color">₹ {item.amount}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </>
        )

      case 'Competitor':
        return (
          <>
            <div className="gap-4 md:gap-x-6 grid sm:grid-cols-2">
              {competitor.map((item) => {
                return (
                  <div className="flex bg-gray-900 py-3 px-4 text-xs uppercase rounded-sm justify-between">
                    <span className="text-gray-400">{item.name}</span>
                    <span className="capitalize">{item.value}</span>
                  </div>
                )
              })}
            </div>
            {result?.winnings.length > 0 && (
              <table className="w-full capitalize my-5 sm:w-1/2">
                <thead className="text-sm text-left border-b text-gray-200">
                  <tr className="">
                    <td className="py-2">Ranks</td>
                    {result?.resultStatus == 1 && (
                      <td className="py-2">Teams</td>
                    )}
                    <td className="py-2">Prizes</td>
                  </tr>
                </thead>
                <tbody className="text-left">
                  {result?.winnings?.map((item) => {
                    const all = teams?.results?.map((it) => {
                      return it.rank === item.rank && it.name
                    })
                    return (
                      <tr key={item.rank} className="text-xs text-gray-200">
                        <td className="py-2">#{item.rank}</td>
                        {result?.resultStatus == 1 && (
                          <td className="py-2 capitalize">
                            {all?.map((val) => (
                              <p key={val}>{val}</p>
                            ))}
                          </td>
                        )}
                        <td className="py-2 text-color">₹ {item.amount}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </>
        )

      case 'Rules':
        return (
          <>
            {result?.rules?.length == 1 && (
              <div className="text-center text-sm">No Rules</div>
            )}

            <div className="space-y-2">
              {result?.rules.map((item) => {
                return (
                  item.length > 0 && (
                    <p
                      key={item}
                      className=" capitalize text-sm gap-2.5 flex items-start text-gray-100 "
                    >
                      <BsCheck2Circle className="text-lg text-color" /> {item}
                    </p>
                  )
                )
              })}
            </div>
          </>
        )
    }
  }

  return (
    <div className="pb-6">
      <section className="tracking-wider h-full">
        <div className="w-full relative table-container overflow-y-scroll bg-secondary rounded shadow">
          {/* Banner */}
          <section className="relative rounded-t-lg block h-44 sm:h-52 md:h-60 lg:h-72">
            <div
              className="absolute top-0 rounded-t-lg w-full h-full bg-center bg-cover"
              style={{
                backgroundImage: `url("${playerDetails?.gameImage}")`,
              }}
            >
              <span
                id="blackOverlay"
                className="w-full sm:p-4 p-2.5 h-full flex flex-col justify-between rounded-t-lg absolute bg-modal "
              >
                {/* Back Button */}
                <div className="sm:text-lg  gap-2 sm:gap-2.5 items-center flex   text-white">
                  <IoIosArrowBack
                    onClick={() => navigate(-1)}
                    className="bg-button rounded text-gray-900 p-1 sm:p-1.5  cursor-pointer text-2xl sm:text-3xl"
                  />
                  {playerDetails?.gameName} Game
                </div>
              </span>
            </div>
          </section>

          {/* Tabs */}
          <div className="flex p-3 sm:p-4 overflow-x-auto overflow-y-hidden  border-gray-200 whitespace-nowrap ">
            {['Overview', 'Competitor'].map((item) => {
              return (
                <button
                  onClick={() => handleTabs(item)}
                  className={`inline-flex text-sm uppercase border-b-2 font-medium border-gray-700 items-center pb-2 text-center ${
                    modals.activeTab === item
                      ? 'text-color   border-color'
                      : ' text-gray-500'
                  }  bg-transparent px-5 whitespace-nowrap focus:outline-none`}
                >
                  {item}
                </button>
              )
            })}
          </div>
          <div className="px-3 sm:px-4 pb-7">{tabs()}</div>
        </div>

        {/* ------------- Declare result modal --------------- */}
        {/* {showDeclare && (
          <DeclareResult
            results={teams?.results}
            winners={teams?.results?.length}
            tour_id={state}
            handleCloseModal={() => setShowDeclare(false)}
          />
        )} */}
      </section>

      {/* confirmation modal */}
      {modals.confirmModal && (
        <>
          <div className="tracking-wider overflow-hidden absolute z-50 top-0 items-center flex justify-center left-0 w-full h-screen bg-modal">
            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-select rounded-lg shadow-xl rtl:text-right  sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="flex items-center justify-center">
                  <FcApproval className="text-3xl" />
                </div>

                <div className="mt-2 text-center">
                  <h3
                    className="font-medium leading-6 text-color capitalize"
                    id="modal-title"
                  >
                    Tournaments Settled
                  </h3>
                </div>
              </div>

              <div className="flex mt-5 sm:flex-row flex-col sm:items-center gap-3">
                <button
                  onClick={() => handleCloseModal('confirmModal')}
                  type="button"
                  className="border border-color w-full justify-center text-sm flex items-center gap-1 cursor-pointer tracking-wider p-2 sm:px-4 rounded text-white"
                >
                  Cancel
                </button>

                <button
                  // onClick={handleSettlement}
                  onClick={() => {
                    handleSettlement('confirmModal')
                    handleCloseModal('confirmModal')
                  }}
                  type="button"
                  disabled={loading}
                  className="bg-button border border-color w-full justify-center text-sm flex items-center gap-1 cursor-pointer tracking-wider p-2 sm:px-4 rounded text-white"
                >
                  {loading ? <ButtonLoader /> : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* view players */}
      {modals.playersModal && (
        <ViewTeam
          handleClose={() => handleCloseModal('playersModal')}
          teamId={teamId}
        />
      )}
    </div>
  )
}

export default Layout(TdmPlayersDetails)
