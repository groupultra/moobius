import { useHistory } from "@docusaurus/router";
import banner from "@site/static/img/Home.png";
import React from "react";
import style from "./style.module.css";
export default function DocsBanner(props) {
  const { push } = useHistory();
  return (
    <div className={style.banner}>
      <div className={style.banner_title}>
        <h1>{props.title}</h1>
        <p>{props.desc}</p>
        <button
          className={style.banner_btn}
          onClick={() => {
            push("tutorial-basics/GettingStarted");
          }}
        >
          Get Started
        </button>
      </div>
      <div className={style.banner_img}>
        <img src={banner} alt="moobius" />
      </div>
    </div>
  );
}
