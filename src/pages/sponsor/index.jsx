import React, { useEffect, useState } from 'react'
import Layout from '../../layouts'
import Heading from '../../components/Heading'
import Button from '../../components/Button'
import SearchBox from '../../components/SearchBox'
import { BsPlus } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import {
  getSponsor,
  deleteSponsor,
  updatesponsorStatus,
} from '../../redux/actions/sponsorAction'
import TableImage from '../../components/TableImage'
import Toggle from '../../components/Toggle'
import ShowOption from '../../components/ShowOption'
import { MdOutlineCloudDownload } from 'react-icons/md'
import NewSponsor from './NewSponsor'
import Pagination from '../../components/Pagination'
import ConfrimationModal from '../../components/ConfrimationModal'
import TableLoader from '../../components/Skeleton/TableLoader'

const Sponsor = () => {
  const dispatch = useDispatch()
  const { sponsor, loading } = useSelector((state) => state.sponsorReducer)
  const { results, imageUrl } = sponsor

  const [modals, setModals] = useState({
    formModal: false,
    deleteModal: false,
    skeleton: false,
  })
  const [editData, setEditData] = useState()
  const [searchValue, setSearchValue] = useState()
  const [currentPage, setCurrentPage] = useState(1)

  // handle Open modal
  const handleOpenModal = (name) => {
    setModals({ ...modals, [name]: true })
  }
  // handle Close modal
  const handleCloseModal = (name) => {
    setModals({ ...modals, [name]: false })
    setEditData()
  }

  // Api Handles
  const handleDeleteSponsor = () => {
    dispatch(deleteSponsor(editData._id, () => handleCloseModal('deleteModal')))
  }
  const handleStatusUpdate = (event) => {
    const payload = { status: event.target.checked }
    dispatch(updatesponsorStatus(event.target.id, payload))
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
    dispatch(getSponsor())
    setTimeout(() => handleOpenModal('skeleton'), 800)
  }, [dispatch])

  return (
    <div className="tracking-wider h-full">
      <Heading title="Sponsor" />

      <section className="w-full relative pb-0 bg-secondary p-3 mt-2 sm:mt-3 rounded shadow ">
        {/* search & button */}
        <div className="flex sm:flex-row flex-col gap-3 pt-1 pb-4 sm:items-center sm:justify-between">
          <SearchBox
            placeholder="Sponsor"
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
            <Button
              title={`Add Sponsor`}
              icon={<BsPlus className="text-xl" />}
              event={() => handleOpenModal('formModal')}
            />
          </span>
        </div>

        {/* Table Data */}
        {results?.length === 0 ? (
          <div className="text-center py-14">No Sponsor Found</div>
        ) : (
          <>
            {modals.skeleton ? (
              <>
                <div className="table-container">
                  <table className="w-full down  text-left whitespace-nowrap">
                    <thead>
                      <tr>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head rounded-tl-lg">
                          Image
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head">
                          Link
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head">
                          Status
                        </th>
                        <th className="p-3 px-4 title-font tracking-wider font-medium text-sm table-head rounded-tr-lg">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-xs relative h-full overflow-y-auto">
                      {(searchValue ? filteredData : results)
                        ?.slice(trimStart, trimEnd)
                        .map((item, i) => {
                          const { _id, link, status, image } = item

                          return (
                            <tr
                              key={_id}
                              className={`${i % 2 !== 0 && 'table-head'}`}
                            >
                              <td className="px-4 py-1  max-w-[50px]  ">
                                <TableImage src={`${imageUrl}${image}`} />
                              </td>
                              <td className="px-4 py-1">
                                <div
                                  onClick={() => {
                                    window.open(link)
                                  }}
                                  className="cursor-pointer"
                                >
                                  {link}
                                </div>
                              </td>

                              <td className="px-4 py-1">
                                <Toggle
                                  _id={_id && _id}
                                  value={status}
                                  handleChange={handleStatusUpdate}
                                />
                              </td>

                              <td className="px-4 text-center relative ">
                                <ShowOption
                                  handleDelete={() => {
                                    setEditData(item)
                                    handleOpenModal('deleteModal')
                                  }}
                                  handleEdit={() => {
                                    setEditData(item)
                                    handleOpenModal('formModal')
                                  }}
                                />
                              </td>
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
      {modals.formModal && (
        <NewSponsor
          editData={editData}
          imageUrl={imageUrl}
          handleCloseModal={() => handleCloseModal('formModal')}
        />
      )}
      {modals.deleteModal && (
        <ConfrimationModal
          handleCancel={() => handleCloseModal('deleteModal')}
          handleConfirm={handleDeleteSponsor}
          title="Sponsor"
          loading={loading}
        />
      )}
    </div>
  )
}

export default Layout(Sponsor)
