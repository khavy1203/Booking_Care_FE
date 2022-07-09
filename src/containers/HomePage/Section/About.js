import React, { Component } from "react";
import { connect } from "react-redux";
// import { FormattedMessage } from "react-intl";

class About extends Component {
  render() {
    return (
      <div className="section-share section-about">
        <div className="section-about-header">
          Write title here for About page
        </div>
        <div className="section-about-content">
          <div className="content-left">
            <iframe
              width="100%"
              height="400px"
              src="https://www.youtube.com/embed/o8GrqUSdzi0"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="content-right">
            Sit dolor consequat exercitation velit nisi. Esse incididunt et
            officia tempor aliquip dolor consequat cillum. Aute officia
            consectetur aliqua esse est. Aliquip cillum veniam non et ad
            consequat dolor ad commodo irure tempor quis labore exercitation. Id
            culpa exercitation eiusmod sit quis et est esse commodo laboris amet
            eu. Ullamco elit aute culpa eu Lorem amet. Aliqua enim quis ut
            labore aute. Sit esse do consectetur tempor adipisicing minim
            adipisicing laborum proident ipsum ullamco ullamco ipsum. Amet culpa
            occaecat officia aute dolore minim quis consequat. Aute consectetur
            nostrud ut labore fugiat mollit occaecat irure proident qui commodo
            mollit veniam. Cillum culpa cupidatat pariatur et exercitation
            cupidatat est ex cillum sunt laborum non ad. Labore consectetur
            irure irure voluptate officia magna ea ut sint commodo consequat
            dolor commodo voluptate. Ex sit dolor et do irure nostrud pariatur
            minim. Occaecat nisi qui labore fugiat ut. Tempor ad nostrud ea
            exercitation officia sunt anim nostrud eiusmod Lorem reprehenderit.
            Et enim pariatur id veniam. Nostrud cupidatat eiusmod est
            adipisicing sit ullamco labore minim do.
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
