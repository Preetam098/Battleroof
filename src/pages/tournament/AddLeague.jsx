import { BiTrashAlt } from 'react-icons/bi'
import { AiFillPlusCircle } from 'react-icons/ai'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdClose, MdOutlineCloudUpload } from 'react-icons/md'

import { addTournament, updateTour } from '../../redux/actions/tournamentAction'
import { getGames } from '../../redux/actions/gameAction'
import ButtonLoader from '../../components/ButtonLoader'
import SimpleReactValidator from 'simple-react-validator'
import ShowError from '../../components/ShowError'

const NewTour = ({ handleCloseModal, editData, imageUrl }) => {
  const [totalTeams, setTotalTeams] = useState('')

  const [qualifierGroups, setQualifierGroups] = useState([])

  const [quarterFinalTeams, setQuarterFinalTeams] = useState('')

  const [quarterFinalGroups, setQuarterFinalGroups] = useState([])

  const [semiFinalTeams, setSemiFinalTeams] = useState('')

  const [semiFinalGroups, setSemiFinalGroups] = useState([])

  const [finalTeams, setFinalTeams] = useState([])

  const [finalGroups, setFinalGroups] = useState([])

  const handleTotalTeamsChange = (e) => {
    const value = e.target.value

    setTotalTeams(value)
  }

  const generateQualifierGroups = () => {
    const total = parseInt(totalTeams)

    if (isNaN(total) || total <= 0) {
      alert('Please enter a valid number of teams.')

      return
    }

    const groups = Math.ceil(total / 20)

    const groupsArray = Array.from({ length: groups }, (_, index) => {
      const start = index * 20 + 1

      const end = Math.min((index + 1) * 20, total)

      return `Group ${index + 1}: Teams ${start} to ${end}`
    })

    setQualifierGroups(groupsArray)
  }

  const handleQuarterFinalTeamsChange = (e) => {
    const value = e.target.value

    setQuarterFinalTeams(value)
  }

  const generateQuarterFinalGroups = () => {
    const total = parseInt(quarterFinalTeams)

    if (isNaN(total) || total <= 0) {
      alert('Please enter a valid number of teams for the quarter-finals.')

      return
    }

    const groups = Math.ceil(total / 20)

    const groupsArray = Array.from({ length: groups }, (_, index) => {
      const start = index * 20 + 1

      const end = Math.min((index + 1) * 20, total)

      return `Quarter-Final Group ${index + 1}: Teams ${start} to ${end}`
    })

    setQuarterFinalGroups(groupsArray)
  }

  const handleSemiFinalTeamsChange = (e) => {
    const value = e.target.value

    setSemiFinalTeams(value)
  }

  const generateSemiFinalGroups = () => {
    const total = parseInt(semiFinalTeams)

    if (isNaN(total) || total <= 0) {
      alert('Please enter a valid number of teams for the semi-finals.')

      return
    }

    const groups = Math.ceil(total / 20)

    const groupsArray = Array.from({ length: groups }, (_, index) => {
      const start = index * 20 + 1

      const end = Math.min((index + 1) * 20, total)

      return `Semi-Final Group ${index + 1}: Teams ${start} to ${end}`
    })

    setSemiFinalGroups(groupsArray)
  }

  const generateFinalTeams = () => {
    if (semiFinalGroups.length === 0) {
      alert('Please generate semi-final groups first.')

      return
    }

    const teamsFromSemiFinals = semiFinalGroups.reduce((acc, group) => {
      const regex = /Teams (\d+) to (\d+)/

      const match = group.match(regex)

      if (match) {
        const start = parseInt(match[1])

        const end = parseInt(match[2])

        for (let i = start; i <= end; i++) {
          acc.push(`Team ${i}`)
        }
      }

      return acc
    }, [])

    const top20Teams = teamsFromSemiFinals.slice(0, 20)

    setFinalTeams(top20Teams)
  }

  const dispatch = useDispatch()
  const [preview, setPreview] = useState()
  const [errors, setErrors] = useState({})
  const [isEdit, setIsEdit] = useState(false)
  const [formInput, setFormInput] = useState({})
  const [ruleInput, setRuleInput] = useState([''])
  const [winningPrizes, setWinningPrizes] = useState([])
  const [message, setMessage] = useState('')
  const { results } = useSelector((state) => state.gameReducer.games)
  const { loading } = useSelector((state) => state.tournamentReducer)

  const PriceArray = [
    {
      id: 1,
      entryFeeType: 'rupee',
    },
    {
      id: 2,
      entryFeeType: 'coin',
    },
  ]

  const validator = new SimpleReactValidator({
    className: 'text-danger',
    validators: {
      number: {
        message: 'The :attribute must be a number.',
        rule: function (val, params, validator) {
          return (
            validator.helpers.testRegex(val, /^\d+$/) &&
            params.indexOf(val) === -1
          )
        },
      },
      minDate: {
        message: 'The :attribute must be greater than to current time.',
        rule: function (val, params, validator) {
          let currentTime = new Date().getTime()
          let startTime = new Date(val).getTime()
          return val && currentTime < startTime
        },
      },
      maxDate: {
        message: 'The :attribute must be greater than to start time.',
        rule: function (val, params, validator) {
          let startTime = new Date(formInput.startDateTime).getTime()
          let endTime = new Date(val).getTime()
          return val && startTime < endTime
        },
      },
    },
  })

  // handleCalculatePrize
  const handleCalculatePrize = () => {
    const { totalSlots, entryFee, commission, totalWinners } = formInput

    // condition: totalSlots && entryFee && commission.toString() && totalWinners
    if (totalSlots && entryFee && commission.toString()) {
      // Calculate the total entry fee amount
      const totalEntryFee = totalSlots * entryFee

      // Calculate the commission amount
      const totalCommission = (totalEntryFee * commission) / 100

      // Calculate the prize pool amount after deducting the commission
      const prizePool = totalEntryFee - totalCommission

      // Calculate the total number of winners based on rank
      const totalWin = Math.min(totalWinners, totalSlots)

      // Calculate the winning amount for each rank
      let winningAmounts = Array.from(Array(totalWin), (_, i) => {
        const rank = totalWin - i
        const coins = Math.floor(
          (2 * prizePool * rank) / (totalWin * (totalWin + 1)),
        )

        return { name: `Rank4${i}`, value: coins || 0 }
      })

      setWinningPrizes(winningAmounts)
      setMessage(
        totalWinners === '' || totalWinners === '0' || totalWinners === 0
          ? 'There are no winners declared.'
          : '',
      )
    }
  }

  // Handle Change Winning Prizes
  const handleWinningPrize = (index, event) => {
    const { value } = event.target
    // const prizes = [...winningPrizes];
    // prizes[index] = value;
    winningPrizes[index].value = value
    setWinningPrizes(winningPrizes)
  }

  // handleChange
  const handleChange = (event) => {
    const { name, type, value } = event.target
    setErrors({ ...errors, [name]: '' })

    if (
      name === 'totalSlots' ||
      name === 'entryFee' ||
      name === 'totalWinners' ||
      name === 'commission'
    ) {
      setWinningPrizes([])
    } else if (name === 'gameMode') {
      let forminputDummy = formInput

      if (forminputDummy.totalSlots) {
        forminputDummy.totalSlots = ''
      }
      setFormInput(forminputDummy)
    }
    setIsEdit(true)
    if (type === 'file') {
      setPreview(URL?.createObjectURL(event.target.files[0]))
      setFormInput({ ...formInput, [name]: event.target.files[0] })
    } else {
      setFormInput({ ...formInput, [name]: value })
    }
  }

  // duplicate rule input
  const addRuleInput = () => {
    const rowsInput = ''
    setRuleInput([...ruleInput, rowsInput])
  }

  // delete rule input
  const deleteRuleInput = (index) => {
    const rows = [...ruleInput]
    rows.splice(index, 1)
    setRuleInput(rows)
  }

  // handle Rule Change
  const handleRuleChange = (index, evnt) => {
    const { value } = evnt.target
    const rowsInput = [...ruleInput]
    rowsInput[index] = value
    setIsEdit(true)
    setRuleInput(rowsInput)
  }

  // handleSubmit
  const handleSubmit = (event) => {
    event.preventDefault()
    const keys = Object.keys(formInput)
    let winning = winningPrizes.map((item, index) => {
      return {
        rank: index + 1,
        amount: item.value,
      }
    })

    if (winning.length === 0 && editData?.winnings.length > 0) {
      winning = editData?.winnings
    }
    let winninPriceFilter = []
    if (winningPrizes != []) {
      winningPrizes.map((item, index) => {
        winninPriceFilter.push(item.value)
      })
    }

    const totalDistributedCoins = winninPriceFilter.reduce(
      (total, coins) => parseInt(total) + parseInt(coins),
      0,
    )

    let payload = new FormData()
    keys.map((item) => {
      return payload.append(item, formInput[item])
    })
    payload.append('rules', ruleInput)
    payload.append('winnings', JSON.stringify(winning))
    payload.append('prizePool', totalDistributedCoins)

    // if (totalWinners === '' || totalWinners === '0' || totalWinners === 0) {
    //   setMessage('There are no winners declared.')
    // } else {
    if (validator.allValid()) {
      if (editData) {
        dispatch(updateTour(editData?._id, payload, handleCloseModal))
        // if (isEdit) {
        //   dispatch(updateTour(editData?._id, payload, handleCloseModal))
        // } else {
        //   handleCloseModal()
        // }
      } else {
        dispatch(addTournament(payload, handleCloseModal))
      }
    } else {
      validator.showMessages()
      setErrors(validator.errorMessages)
    }
    // }
  }

  // useffect
  useEffect(() => {
    dispatch(getGames())
    if (editData) {
      const { rules, winnings, prizePool, ...other } = editData
      setRuleInput(rules)
      setFormInput(other)
    }
  }, [dispatch, editData])

  const checkBool = () => {
    if (formInput?.gameMode === 'solo' && formInput?.totalSlots > 100) {
      return true
    } else if (formInput?.gameMode === 'duo' && formInput?.totalSlots > 50) {
      return true
    } else if (formInput?.gameMode === 'squad' && formInput?.totalSlots > 25) {
      return true
    } else {
      return false
    }
  }

  return (
    <div className="tracking-wider overflow-hidden absolute z-50 top-0 flex justify-end left-0 w-full h-screen bg-modal">
      <div className="w-full sm:w-5/6 lg:w-4/5 h-full overflow-auto p-4 bg-secondary">
        {/* Top */}
        <div className="flex justify-between items-center">
          <span className="text-color">
            {editData ? 'Update' : 'Add'} League Tournaments
          </span>
          <MdClose
            className="text-xl cursor-pointer"
            onClick={handleCloseModal}
          />
        </div>

        <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
          {/* Tournament, Game, StreamingLink, Mode, Map, Format */}
          <section
          //   className="grid gap-4 items-start xs:grid-cols-2 lg:grid-cols-3"
          >
            <h1>Tournament Groups Generator</h1>

            <div>
              <label htmlFor="totalTeams">Enter Total Number of Teams:</label>
              <br />
              <div className="grid gap-4 items-start xs:grid-cols-2 lg:grid-cols-2">
                <input
                  type="number"
                  id="totalTeams"
                  value={totalTeams}
                  onChange={handleTotalTeamsChange}
                  className="rounded bg-transparent  py-1 px-2 outline-none border"
                />

                <button
                  onClick={generateQualifierGroups}
                  className="bg-button justify-center self-end flex cursor-pointer tracking-wider py-1.5 px-4 rounded text-white"
                >
                  Generate Qualifier Groups
                </button>
              </div>
            </div>

            <div>
              <h2
                style={{
                  color: '#24975d',
                }}
              >
                Qualifier Groups:
              </h2>
              <br />

              <ul>
                <div className="grid gap-4 items-start xs:grid-cols-2 lg:grid-cols-4">
                  {qualifierGroups.map((group, index) => (
                    <li key={index}>{group}</li>
                  ))}
                </div>
              </ul>

              <br />
            </div>

            <div>
              <label htmlFor="quarterFinalTeams">
                Enter Total Number of Teams for Quarter-Finals:
              </label>
              <br />
              <div className="grid gap-4 items-start xs:grid-cols-2 lg:grid-cols-2">
                <input
                  type="number"
                  id="quarterFinalTeams"
                  value={quarterFinalTeams}
                  onChange={handleQuarterFinalTeamsChange}
                  className="rounded bg-transparent  py-1 px-2 outline-none border"
                />

                <button
                  onClick={generateQuarterFinalGroups}
                  className="bg-button justify-center self-end flex cursor-pointer tracking-wider py-1.5 px-4 rounded text-white"
                >
                  Generate Quarter-Final Groups
                </button>
              </div>
            </div>

            <div>
              <h2
                style={{
                  color: '#24975d',
                }}
              >
                Quarter-Final Groups:
              </h2>
              <br />

              <ul>
                <div className="grid gap-4 items-start xs:grid-cols-2 lg:grid-cols-3">
                  {quarterFinalGroups.map((group, index) => (
                    <li key={index}>{group}</li>
                  ))}
                </div>
              </ul>
              <br />
            </div>

            <div>
              <label htmlFor="semiFinalTeams">
                Enter Total Number of Teams for Semi-Finals:
              </label>
              <br />
              <div className="grid gap-4 items-start xs:grid-cols-2 lg:grid-cols-2">
                <input
                  type="number"
                  id="semiFinalTeams"
                  value={semiFinalTeams}
                  onChange={handleSemiFinalTeamsChange}
                  className="rounded bg-transparent  py-1 px-2 outline-none border"
                />

                <button
                  onClick={generateSemiFinalGroups}
                  className="bg-button justify-center self-end flex cursor-pointer tracking-wider py-1.5 px-4 rounded text-white"
                >
                  Generate Semi-Final Groups
                </button>
              </div>
            </div>

            <div className="mt-[10px]">
              <h2
                style={{
                  color: '#24975d',
                }}
              >
                Semi-Final Groups:
              </h2>
              <br />

              <ul>
                <div className="grid gap-4 items-start xs:grid-cols-2 lg:grid-cols-3">
                  {semiFinalGroups.map((group, index) => (
                    <li key={index}>{group}</li>
                  ))}
                </div>
              </ul>
            </div>
            <br />

            <div>
              <button
                onClick={generateFinalTeams}
                className="bg-button justify-center self-end flex cursor-pointer tracking-wider py-1.5 px-4 rounded text-white"
              >
                Get Top 20 Teams for the Final
              </button>
            </div>
            <br />

            <div className="mt-2">
              <h2
                style={{
                  color: '#24975d',
                }}
              >
                Top 20 Teams for the Final:
              </h2>
              <br />

              <ul>
                <div className="grid gap-4 items-start xs:grid-cols-2 lg:grid-cols-4">
                  {finalTeams.map((team, index) => (
                    <li key={index}>{team}</li>
                  ))}
                </div>
              </ul>
            </div>
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || checkBool()}
            className="bg-button justify-center flex items-center cursor-pointer tracking-wider py-2 px-4 rounded text-white"
            style={{ background: checkBool() ? '#707070' : '#24975d' }}
          >
            {loading ? <ButtonLoader /> : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default NewTour
