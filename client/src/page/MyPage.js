import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import { TiArrowSortedDown } from "react-icons/ti";
import { TiArrowSortedUp } from "react-icons/ti";
import { BsGrid3X3 } from "react-icons/bs";
import { BsBookmark } from "react-icons/bs";

import Cookie from "../util/Cookie";
import MyPlants from "../components/MyPage/MyPlants";
import UserInfo from "../components/MyPage/UserInfo";
import Gallery from "../components/MyPage/Gallery";
import AddPlant from "../components/MyPage/AddPlant";
import View from "../components/Home/View";
import CommentModal from "../components/Home/CommentModal";
import PlantImageView from "../components/MyPage/PlantImageView";
import Followers from "../components/MyPage/Followers";
import Followings from "../components/MyPage/Followings";
import Footer from "../components/public/Footer";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;

  > .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  @media screen and (max-width: 770px) {
    position: relative;
    top: 60px;
  }
`;

const StyledMyPlantFolder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 500px;
  border-bottom: solid 1px #dbdbdb;
  p {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
`;

const StyledChangeViewContainer = styled.div`
  display: flex;
  justify-content: space-around;
  border-bottom: solid 1px #dbdbdb;
`;

const StyledChangeViewButton = styled.div`
  display: flex;
  align-items: center;
  border: none;
  background-color: white;
  color: #ababa7;
  margin: 10px 0;
  cursor: pointer;
  span {
    margin: 0 5px;
  }
  &.selected {
    border-bottom: solid black 1px;
    color: black;
  }
`;

const MyPage = ({ isCovered, handleIsCovered, handleChange }) => {
  const cookie = new Cookie();
  const jwt = cookie.get("authorization")
  const memberId = useLocation().state.id;

  // ????????? ????????????
  const [userInfo, setUserInfo] = useState([]); // ???????????? (UserInfo.js??? props)
  const [postCount, setPostCount] = useState(); // ????????? ?????? (setState??? UserInfo.js?????? ?????????)
  const [curPost, setCurPost] = useState(); // View.js??? prop?????? ?????? ?????????
  const [commentId, setCommentId] = useState(null);
  const [commentMenu, setCommentMenu] = useState(false);
  const [currentPlantData, setCurrentPlantData] = useState(null);
  const [plantImageViewData, setplantImageViewData] = useState({
    imgs: [],
    imgIdx: null,
  });
  
  // ?????? ??? ????????????
  const [isFolderOpened, setIsFolderOpened] = useState(false); // myPlants ?????????/?????? ??????
  const [currentView, setCurrentView] = useState("postings"); // ?????? view (Gallery.js??? ????????? ??????????????? ?????? ??????)
  const [isAddPlantOpened, setIsAddPlantOpened] = useState(false); // AddPlant.js ?????? ????????? ??????????????? ?????? ??????
  const [isViewOpened, setIsViewOpened] = useState(false); // Gallery.js?????? map ????????? ?????? ?????? ?????? ??? ??????(View.js) ????????? 
  const [isPlantImageViewOpened, setIsPlantImageViewOpened] = useState(false);
  const [isFollowersOpened, setIsFollowersOpened] = useState(false);
  const [isFollowingsOpened, setIsFollowingsOpened] = useState(false);

  useEffect(() => {
    getUserInfo()
  }, [memberId])
  
  const getUserInfo = () => {
      axios({
        method: "get",
        url: `${process.env.REACT_APP_API}/members/${memberId}`,
        headers: {
          Authorization: jwt,
        },
      }).then((res) => {
        setUserInfo(res.data.data)
      }).catch ((err) => 
      console.error(err))
  };

  const handleFollowers = () => {
    setIsFollowersOpened(!isFollowersOpened)
    handleIsCovered();
  }

  const handleFollowings = () => {
    setIsFollowingsOpened(!isFollowingsOpened)
    handleIsCovered();
  }

  const handleAddPlant = () => {
    setIsAddPlantOpened(!isAddPlantOpened);
    handleIsCovered();
  }
 
  const handleModal = (postingData) => {
    setCurPost(postingData);
    setIsViewOpened(!isViewOpened);
    handleIsCovered();
  };

  const handlePlantImageView = (imgs, imgIdx) => {
    setplantImageViewData({
      imgs: imgs,
      imgIdx: imgIdx
    })
    setIsPlantImageViewOpened(!isPlantImageViewOpened);
    handleIsCovered()
  }

  const handleFolderClick = () => {
    if (isFolderOpened) {
      setIsFolderOpened(false);
      setCurrentView("postings")
    } else {
      setIsFolderOpened(true);
      setCurrentView("plant")
    }
  };

  const handleCommentMenu = () => {
    setCommentMenu(!commentMenu);
  }

  return (
    <>
      {commentMenu && <CommentModal post={curPost} handleCommentMenu={handleCommentMenu} handleChange={handleChange} commentId={commentId}/>}
      {isCovered && isViewOpened && <View handleModal={handleModal} curPost={curPost} handleChange={handleChange} handleCommentMenu={handleCommentMenu} setCommentId={setCommentId}/>}
      {isCovered && isAddPlantOpened && <AddPlant jwt={jwt} handleAddPlant={handleAddPlant} userInfo={userInfo} handleChange={handleChange} />}
      {isCovered && isPlantImageViewOpened && <PlantImageView handlePlantImageView={handlePlantImageView} plantImageViewData={plantImageViewData} />}
      {isCovered && isFollowersOpened && <Followers handleFollowers={handleFollowers} followers={userInfo.followerList}/>}
      {isCovered && isFollowingsOpened && <Followings handleFollowings={handleFollowings} followings={userInfo.followingList}/>}
      <StyledContainer>
        <UserInfo handleFollows={handleFollowers} handleFollowings={handleFollowings} userInfo={userInfo} postCount={postCount}/>
        {isFolderOpened && 
          <div className="container">
            <MyPlants
              currentPlantData={currentPlantData}
              setCurrentPlantData={setCurrentPlantData}
              userInfo={userInfo}
              currentView={currentView}
              setCurrentView={setCurrentView}
              handleAddPlant={handleAddPlant}
              handleChange={handleChange}
            />
            <StyledMyPlantFolder onClick={handleFolderClick}>
              {currentPlantData && <Gallery isCovered={isCovered} isPlantImageViewOpened={isPlantImageViewOpened} setPostCount={setPostCount} currentView={currentView} userInfo={userInfo} currentPlantData={currentPlantData} handlePlantImageView={handlePlantImageView}/> }
              <p>
                My Plants ?????? <TiArrowSortedUp />
              </p>
            </StyledMyPlantFolder>
          </div>
        }
        {!isFolderOpened &&
          <div className="container">
          <StyledMyPlantFolder>
            <p onClick={handleFolderClick}>
              My Plants ????????? <TiArrowSortedDown />
            </p>
            <StyledChangeViewContainer>
              <StyledChangeViewButton
                onClick={() => setCurrentView("postings")}
                className={currentView === "postings" && "selected"}
              >
                <BsGrid3X3 />
                <span>?????????</span>
              </StyledChangeViewButton>
              <StyledChangeViewButton
                onClick={() => setCurrentView("scraps")}
                className={currentView === "scraps" && "selected"}
              >
                <BsBookmark />
                <span>?????????</span>
              </StyledChangeViewButton>
            </StyledChangeViewContainer>
            <Gallery setPostCount={setPostCount} currentView={currentView} handleModal={handleModal} userInfo={userInfo}/>
          </StyledMyPlantFolder>
        </div>
        }
      </StyledContainer>
      <Footer />
    </>
  );
};

export default MyPage;
