import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout tittle={'About us - Movie Ticketing'}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/aboutus.jpg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p className="text-justify mt-2">
            Hi, We are a team of passionate movie lovers who wanted to create a platform that makes it easy 
            for people to find and book tickets for their favorite movies. Our goal is to provide a seamless 
            and enjoyable experience for moviegoers, from browsing showtimes to purchasing tickets. 
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;