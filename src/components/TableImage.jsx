import React, { memo, useState } from "react";

const TableImage = (props) => {
  const { bannerBool, src } = props;
  const [imgUrl, setimgUrl] = useState(src);
  const handleImageError = () => {
    setimgUrl("https://img.freepik.com/free-icon/user_318-159711.jpg");
  };
  return (
    <div style={{ width: "100%" }}>
      {bannerBool ? (
        <img
          src={imgUrl}
          onError={handleImageError}
          style={{
            height: 40,
            width: 80,
            objectFit: "cover",
            objectPosition: "center",
          }}
          alt="img"
          // className=" sm:w-11 sm:h-11 w-14 h-10  object-cover object-center"
        />
      ) : (
        <img
          onError={handleImageError}
          src={imgUrl}
          alt="img"
          className=" sm:w-11 sm:h-11 w-10 h-10  rounded-full object-cover object-center"
        />
      )}
    </div>
  );
};

export default memo(TableImage);
