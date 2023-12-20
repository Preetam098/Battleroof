import React, { useEffect, useState } from "react";
import Layout from "../../layouts";
import { useDispatch, useSelector } from "react-redux";
import { getSetting, updateSetting } from "../../redux/actions/authAction";
import { IoIosArrowBack } from "react-icons/io";

import { MdCloudUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ButtonLoader from "../../components/ButtonLoader";
import SimpleReactValidator from "simple-react-validator";
import ShowError from "../../components/ShowError";
import Toggle from "../../components/Toggle";

const Setting = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const [preview, setPreview] = useState();
  const { setting, loading } = useSelector((state) => state.authReducer);
  const { imageUrl, result } = setting;
  const [formInput, setFormInput] = useState({});

  const [errors, setErrors] = useState({});
  const validator = new SimpleReactValidator({
    className: "text-danger",
    validators: {
      fileSize: {
        message: "The :attribute must be max 1MB.",
        rule: function (val, maxSize, validator) {
          return val && val.size <= 1048576;
        },
      },
    },
  });
  // const [selectedFile, setSelectedFile] = useState(null)
  // const containerRef = useRef(null)
  // const fileInputRef = useRef(null)

  /////////// upload apk <code> /////////////

  // const handleClick = () => {
  //   fileInputRef.current.click()
  // }

  // const changeHandler = (event) => {
  //   const { type, name, value } = event.target
  //   const file = event.target.files[0]
  //   console.log('event ====>>>', type, name, value)
  //   console.log(file)
  //   setSelectedFile(file)
  //   setIsEdit(true)
  //   if (type === 'file') {
  //     console.log('event.target.files[0] name', event.target.files[0]?.name)
  //     setPreview(URL.createObjectURL(event.target.files[0]))
  //     setFormInput({ ...formInput, appURL: event.target.files[0] })
  //   } else {
  //     console.log('value==>>>', value)
  //     setFormInput({ ...formInput, appURL: event.target.files[0] })
  //   }

  //   console.log('hello', file)
  // }

  ///////// download apk <code> /////////

  // const handleDownload = () => {
  //   // Add logic to trigger file download here
  //   const appDownloadURL = `${imageUrl}${result?.appURL}`
  //   console.log('appDownloadURL==>>>>', appDownloadURL)
  //   const element = document.createElement('a')
  //   const file = new Blob([result?.appURL], { type: 'text/plain' })
  //   element.href = URL.createObjectURL(file)
  //   element.download = `${result?.appURL}.apk`
  //   document.body.appendChild(element)
  //   element.click()
  //   document.body.removeChild(element)
  // }

  // handle change
  const handleChange = (event) => {
    const { type, name, value } = event.target;
    setErrors({ ...errors, [name]: "" });
    setIsEdit(true);
    if (type === "file") {
      setPreview(URL.createObjectURL(event.target.files[0]));
      setFormInput({ ...formInput, [name]: event.target.files[0] });
    } else {
      setFormInput({ ...formInput, [name]: value });
    }
  };

  // handle submit
  const handleSubmit = (event) => {
    event.preventDefault();
    if (validator.allValid()) {
      if (isEdit) {
        const payload = new FormData();
        Object.keys(formInput).map((item) => {
          return payload.append(item, formInput[item]);
        });
        dispatch(
          updateSetting(payload, () => {
            setIsEdit(false);
            navigate("/dashboard");
          })
        );
      } else {
        navigate("/dashboard");
      }
    } else {
      validator.showMessages();
      setErrors(validator.errorMessages);
    }
  };

  // useEffect
  useEffect(() => {
    dispatch(getSetting((e) => setFormInput(e)));
  }, [dispatch]);
  return (
    <div className="w-full relative table-container bg-secondary  rounded shadow">
      {/* Banner */}
      <section className="relative rounded-t-lg block h-40">
        <div
          className="absolute top-0 rounded-t-lg w-full h-full bg-center bg-cover"
          style={{
            backgroundImage: `url("${imageUrl}${result?.banner}")`,
          }}
        >
          <span
            id="blackOverlay"
            className="w-full sm:p-4 p-2.5 h-full flex flex-col justify-between rounded-t-lg absolute bg-modal "
          >
            {/* Back Button */}
            <div
              onClick={() => navigate("/dashboard")}
              className="  sm:text-lg  gap-2 sm:gap-2.5 items-center flex   text-white"
            >
              <IoIosArrowBack className="bg-button rounded text-gray-900 p-1 sm:p-1.5  cursor-pointer text-2xl sm:text-3xl" />
              {result?.appName}
            </div>
          </span>
        </div>
      </section>

      {/* Content */}
      <div className="flex relative flex-col  justify-center p-5 pt-12 rounded-b-xl">
        <img
          src={preview ? preview : `${imageUrl}${result?.logo}`}
          alt={result?.appName}
          className="w- object-cover h-20 sm:w-32 sm:h-32 sm:-top-16 absolute bg-secondary p-1.5 border-color border-2 -top-10  mx-auto rounded-full aspect-square"
        />

        {/* Form */}
        <form onSubmit={handleSubmit} className="my-7 ">
          <section className="max-w-md grid gap-2.5 mx-auto">
            {/* App Logo */}
            <div className="grid gap-2 text-sm">
              <label
                htmlFor="images"
                className="rounded p-2  flex
                   gap-3 outline-none border-2 items-center border-dashed border-color"
              >
                <MdCloudUpload className="text-xl cursor-pointer" />{" "}
                <span className="text-gray-400 text-sm">
                  {formInput?.logo?.name
                    ? formInput?.logo?.name
                    : " Upload Image"}
                </span>
              </label>
              <input
                autoComplete="off"
                id="images"
                type="file"
                name="logo"
                accept="image/jpeg"
                onChange={handleChange}
                className="rounded py-1.5 px-2  hidden outline-none border border-color"
              />
              {/* {validator.message("logo", formInput?.logo, "fileSize")}
              <ShowError data={errors.logo} /> */}
            </div>

            {/* App Name */}
            <div className="grid gap-1 text-sm">
              <label htmlFor="appName">App Name</label>
              <input
                autoComplete="off"
                id="appName"
                type="text"
                name="appName"
                value={formInput?.appName}
                onChange={handleChange}
                className="rounded p-2 px-3 outline-none border-color border"
              />
            </div>

            {/* App Status */}
            <div className="grid gap-1 text-sm">
              <label htmlFor="appName">App Status</label>
              <select
                id="appStatus"
                name="appStatus"
                value={formInput?.appStatus}
                onChange={handleChange}
                className="rounded bg-select appearance-none text-sm px-2 py-1.5 outline-none border-color border"
              >
                <option value="">Select App Status</option>
                {["Under Maintenance", "Running"]?.map((item) => {
                  return (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Upload APK and Download apk functionality */}
            {/* <div className="grid gap-2 text-sm">
              <label htmlFor="appName">Upload App</label>

              <div className="flex flex-row items-center">
                <div className="flex flex-col w-[98%]">
                  <label
                    ref={containerRef}
                    className="rounded p-2  flex gap-3 outline-none border-2 items-center border-dashed border-color"
                    onClick={handleClick}
                    style={{ cursor: 'pointer' }}
                  >
                    <MdCloudUpload className="text-xl cursor-pointer" />{' '}
                    <span className="text-gray-400 text-sm">
                      {formInput?.appURL?.name
                        ? formInput?.appURL?.name
                        : formInput?.appURL
                        ? formInput?.appURL
                        : ' Upload App'}
                    </span>
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".apk"
                    onChange={changeHandler}
                    className="rounded py-1.5 px-2  hidden outline-none border border-color"
                  />
                </div>
                <div className="ml-1">
                  <button onClick={handleDownload}>
                    <MdOutlineFileDownload
                      className="text-lg cursor-pointer"
                      style={{ fontSize: 25 }}
                    />
                  </button>
                </div>
              </div>
            </div> */}

            {/* URL Link */}
            <div className="grid gap-1 text-sm">
              <label htmlFor="appURL">App URL</label>
              <input
                autoComplete="off"
                id="appURL"
                type="text"
                name="appURL"
                value={formInput?.appURL}
                onChange={handleChange}
                className="rounded p-2 px-3 outline-none border-color border"
              />
            </div>

            {/* app version */}
            <div className="grid gap-1 text-sm">
              <label htmlFor="appVersion">App Version</label>
              <input
                autoComplete="off"
                id="appVersion"
                type="text"
                name="appVersion"
                value={formInput?.appVersion}
                onChange={handleChange}
                className="rounded p-2 px-3 outline-none border-color border"
              />
            </div>

            {/* App otpTemplateId */}
            <div className="grid gap-1 text-sm hidden">
              <label htmlFor="otpTemplateId">MSG91 OTP Template ID</label>
              <input
                autoComplete="off"
                id="otpTemplateId"
                type="text"
                name="otpTemplateId"
                value={formInput?.otpTemplateId}
                onChange={handleChange}
                className="rounded p-2 px-3 outline-none border-color border"
              />
            </div>

            {/* App otpAuthKey */}
            <div className="grid gap-1 text-sm hidden">
              <label htmlFor="otpAuthKey">MSG91 OTP Auth Key</label>
              <input
                autoComplete="off"
                id="otpAuthKey"
                type="text"
                name="otpAuthKey"
                value={formInput?.otpAuthKey}
                onChange={handleChange}
                className="rounded p-2 px-3 outline-none border-color border"
              />
            </div>

            {/* Streaming Link */}
            <div className="grid gap-1 text-sm">
              <label htmlFor="howToPlay">How to play ?</label>
              <input
                autoComplete="off"
                id="howToPlay"
                type="url"
                name="howToPlay"
                value={formInput?.howToPlay}
                onChange={handleChange}
                className="rounded p-2 px-3 outline-none border-color border"
              />
            </div>

            {/* Two Factor API Key */}
            <div className="grid gap-1 text-sm">
              <label htmlFor="twoFactor">Two Factor API Key</label>
              <input
                autoComplete="off"
                id="twoFactorApiKey"
                type="text"
                name="twoFactorApiKey"
                value={formInput?.twoFactorApiKey}
                onChange={handleChange}
                className="rounded p-2 px-3 outline-none border-color border"
              />
            </div>

            {/* SMS Service Provider */}
            {/* <div className="grid gap-1 text-sm">
              <label htmlFor="smsServiceProvider">SMS Service Provider</label>
              <select
                id="smsServiceProvider"
                name="smsServiceProvider"
                value={formInput?.smsServiceProvider}
                onChange={handleChange}
                className=" outline-none bg-select border border-color rounded py-1 px-2 appearance-none tracking-wider text-sm"
              >
                {serviceType.map((item) => {
                  return <option value={item}>{item}</option>
                })}
              </select>
            </div> */}

            {/* tax and reward */}
            <section className="grid sm:grid-cols-2 gap-2.5">
              {" "}
              {/* Tax Percent */}
              <div className="grid gap-1 text-sm">
                <label htmlFor="taxPercent">Platform Fee ( in % )</label>
                <input
                  autoComplete="off"
                  id="taxPercent"
                  type="text"
                  name="taxPercent"
                  value={formInput?.taxPercent}
                  onChange={handleChange}
                  className="rounded p-2 px-3 outline-none border-color border"
                />
              </div>
              {/* Tax Percent */}
              <div className="grid gap-1 text-sm">
                <label htmlFor="rewardUsablePercent">Reward ( in % )</label>
                <input
                  autoComplete="off"
                  id="rewardUsablePercent"
                  type="text"
                  name="rewardUsablePercent"
                  value={formInput?.rewardUsablePercent}
                  onChange={handleChange}
                  className="rounded p-2 px-3 outline-none border-color border"
                />
              </div>
            </section>
            <section className="grid sm:grid-cols-2 gap-2.5">
              <div className="grid gap-1 text-sm">
                <label htmlFor="paymentStatus">Payment Status</label>
                <Toggle
                  // _id={_id && _id}

                  value={formInput?.paymentStatus}
                  handleChange={(event) => {
                    setIsEdit(true);
                    setFormInput({
                      ...formInput,
                      paymentStatus: event.target.checked,
                    });
                  }}
                />
              </div>
            </section>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-button justify-center flex items-center cursor-pointer tracking-wider py-2 px-4 rounded text-white"
            >
              {loading ? <ButtonLoader /> : "Update"}
            </button>
          </section>
        </form>
      </div>
    </div>
  );
};

export default Layout(Setting);
