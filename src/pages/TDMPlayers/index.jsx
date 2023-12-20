import { BsPlus } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdOutlineCloudDownload } from 'react-icons/md'

import {
  deleteGame,
  getGames,
  updateGameStatus,
} from '../../redux/actions/gameAction'

// import NewGame from "./NewGame";
import Layout from '../../layouts'
import Toggle from '../../components/Toggle'
import Button from '../../components/Button'
import Heading from '../../components/Heading'
import SearchBox from '../../components/SearchBox'
import TableImage from '../../components/TableImage'
import Pagination from '../../components/Pagination'
import ShowOption from '../../components/ShowOption'
import PlayButton from '../../components/PlayButton'
import ConfrimationModal from '../../components/ConfrimationModal'
import VideoPopUp from '../../components/VideoPopUp'
import TableLoader from '../../components/Skeleton/TableLoader'
import { BsArrowUp, BsArrowDown } from 'react-icons/bs'

const Games = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [modals, setModals] = useState({
    formModal: false,
    deleteModal: false,
    skeleton: false,
    videoModal: false,
  })
  const [editData, setEditData] = useState()
  const [searchValue, setSearchValue] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  const { results, imageUrl } = useSelector((state) => state.gameReducer.games)

  // handle modals
  const handleOpenModal = (name) => setModals({ ...modals, [name]: true })
  const handleCloseModal = (name) => {
    setEditData()
    setModals({ ...modals, [name]: false })
  }

  // Api Handles
  const handleDeleteGame = () => {
    dispatch(deleteGame(editData._id, () => handleCloseModal('deleteModal')))
  }
  const handleStatusUpdate = (event) => {
    const payload = { status: event.target.checked }
    dispatch(updateGameStatus(event.target.id, payload))
  }

  // Other Handles
  const filteredData = results?.filter(
    (item) =>
      item.name &&
      item.name?.toLowerCase().includes(searchValue?.toLowerCase()),
  )
  const downloadDataInCsv = () => {
    var data = []
    var rows = document.querySelectorAll('table.down tr')

    for (var i = 0; i < rows.length; i++) {
      var row = [],
        cols = rows[i].querySelectorAll('td, th')

      for (var j = 0; j < cols.length; j++) {
        row.push(cols[j].innerText)
      }

      data.push(row.join(','))
    }

    // Create downloadAble
    const a = document.createElement('a')
    const file = new Blob([data.join('\n')], { type: 'text/csv' })
    a.href = URL.createObjectURL(file)
    a.download = 'Data.csv'
    a.click()
  }

  // Pagination Logic
  const perPageItems = 10
  const totalItems = (searchValue ? filteredData : results)?.length
  const trimStart = (currentPage - 1) * perPageItems
  const trimEnd = trimStart + perPageItems
  const handlePrev = () => currentPage !== 1 && setCurrentPage(currentPage - 1)
  const handleForw = () =>
    trimEnd <= totalItems && setCurrentPage(currentPage + 1)

  useEffect(() => {
    dispatch(getGames())
    setTimeout(() => handleOpenModal('skeleton'), 800)
  }, [dispatch])

  // sorting logic
  const [tdmPlayerList, setTDMPlayerList] = useState()

  useEffect(() => {
    if (results?.length > 0) {
      setTDMPlayerList(results)
    }
  }, [])

  const handleSort = () => {
    const sortedWords = results
      .filter((item) => item?.name)
      .slice()
      .sort((a, b) => {
        return a.name?.localeCompare(b.name, undefined, { sensitivity: 'base' })
      })

    results.filter((item) => item?.name === null)
    setTDMPlayerList(sortedWords)
  }

  const reverseHandleSort = () => {
    const sortedWords = results
      .filter((item) => item?.name)
      .slice()
      .sort((a, b) => {
        return b.name?.localeCompare(a.name, undefined, { sensitivity: 'base' })
      })

    results.filter((item) => item?.name === null)
    setTDMPlayerList(sortedWords)
  }

  return (
    <div className="tracking-wider  notification-container pb-12 overflow-auto h-full">
      <Heading title="TDM Challenges" />

      <section className="w-full relative bg-secondary p-3 pb-0 mt-1.5 sm:mt-3 rounded shadow ">
        {/* search & button */}

        <div className="flex sm:flex-row flex-col gap-3 pt-1 pb-4 sm:items-center sm:justify-between">
          <SearchBox
            placeholder="Player"
            value={searchValue}
            handleChange={(event) => setSearchValue(event.target.value)}
          />
          <span className="grid sm:flex grid-cols-2 gap-2">
            {results?.length !== 0 && (
              <Button
                title={`Export`}
                icon={<MdOutlineCloudDownload className="text-xl" />}
                event={downloadDataInCsv}
              />
            )}
            {/* <Button
              title={`Add Game`}
              icon={<BsPlus className="text-xl" />}
              event={() => handleOpenModal("formModal")}
            /> */}
          </span>
        </div>

        {/* Table Data */}
        {results?.length === 0 ? (
          <div className="text-center py-14">No Game Found</div>
        ) : (
          <>
            {modals.skeleton ? (
              <>
                <div className="table-container">
                  <table className="w-full down  text-left whitespace-nowrap">
                    <thead>
                      <tr>
                        <td className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head rounded-tl-lg ">
                          Image
                        </td>
                        <td className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head flex-row items-center flex ">
                          <span className="title-font tracking-wider font-medium text-sm mr-3">
                            Name
                          </span>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              reverseHandleSort()
                            }}
                          >
                            <BsArrowUp />
                          </div>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              handleSort()
                            }}
                          >
                            <BsArrowDown />
                          </div>
                        </td>
                        <td className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head">
                          Banner
                        </td>
                        {/* <td className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head">
                          Link
                        </td>
                        <td className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head">
                          Ad Reward
                        </td>
                        <td className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head">
                          Status
                        </td>
                        <td className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head rounded-tr-lg ">
                          Action
                        </td> */}
                      </tr>
                    </thead>
                    <tbody className="text-xs relative h-full overflow-y-auto">
                      {(searchValue
                        ? filteredData
                        : tdmPlayerList?.length > 0
                        ? tdmPlayerList
                        : results
                      )
                        ?.slice(trimStart, trimEnd)
                        .map((item, i) => {
                          const {
                            _id,
                            name,
                            adRewardCoins,
                            status,
                            slug,
                            betAmount,
                            image,
                            banner,
                          } = item

                          return (
                            <tr
                              key={_id}
                              className={`${i % 2 !== 0 && 'table-head'}`}
                              style={{
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                // navigate(`/${_id}/gamePlayers`, {
                                //   state: {
                                //     title: `User name : ${name}`,
                                //     query: _id,
                                //   },
                                // });
                                navigate('/bet-amount', {
                                  state: {
                                    title: `User name : ${name}`,
                                    query: _id,
                                    gameItem: item,
                                    gameImageUrl: imageUrl,
                                  },
                                })
                              }}
                            >
                              <td className="px-4 py-1">
                                <TableImage src={`${imageUrl}${image}`} />
                              </td>
                              <td className="px-4 py-1">{name}</td>
                              <td className="px-4 py-1 ">
                                <TableImage
                                  bannerBool
                                  src={`${imageUrl}${banner}`}
                                />
                              </td>
                              {/* <td className="px-4 py-1">
                                <PlayButton
                                  event={() => {
                                    setEditData(item);
                                    handleOpenModal("videoModal");
                                  }}
                                />
                              </td> */}
                              {/* <td className="px-4 py-1">
                                {adRewardCoins} Coins
                              </td> */}
                              {/* <td className="px-4 py-1">
                                <Toggle
                                  _id={_id && _id}
                                  value={status}
                                  handleChange={handleStatusUpdate}
                                />
                              </td> */}

                              {/* <td className="px-4 text-center relative ">
                                <ShowOption
                                  handleDelete={() => {
                                    setEditData(item);
                                    handleOpenModal("deleteModal");
                                  }}
                                  handleEdit={() => {
                                    setEditData(item);
                                    handleOpenModal("formModal");
                                  }}
                                  
                                  handleViewTeam={() => {
                                    navigate(`/${_id}/gamePlayers`, {
                                      state: {
                                        title: `User name : ${name}`,
                                        query: _id,
                                      },
                                    });
                                  }}
                                />
                              </td> */}
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  handlePrev={handlePrev}
                  from={trimStart}
                  to={trimEnd}
                  total={totalItems}
                  handleForw={handleForw}
                />
              </>
            ) : (
              <TableLoader />
            )}
          </>
        )}
      </section>

      {/*--------  Modals -------- */}
      {/* {modals.formModal && (
        <NewGame
          editData={editData}
          imageUrl={imageUrl}
          handleCloseModal={() => handleCloseModal("formModal")}
        />
      )} */}
      {modals.deleteModal && (
        <ConfrimationModal
          handleCancel={() => handleCloseModal('deleteModal')}
          handleConfirm={handleDeleteGame}
          title="Game"
        />
      )}
      {/* Video Popup */}
      {modals.videoModal && (
        <VideoPopUp
          src={editData?.streamingLink}
          handleCancel={() => handleCloseModal('videoModal')}
        />
      )}
    </div>
  )
}

export default Layout(Games)
