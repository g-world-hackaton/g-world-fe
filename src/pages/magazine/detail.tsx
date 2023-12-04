import { Swiper, SwiperSlide } from 'swiper/react';
import { css } from '@emotion/react';
import { ReactNode, useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowBack, IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';
import { LiaCommentDots } from 'react-icons/lia';
import { GoShareAndroid } from 'react-icons/go';
import { Pagination } from 'swiper/modules';
import { titleAtom } from '@/store/page-info';

import 'swiper/css';
import 'swiper/css/pagination';
import { getMagazineDetail } from '@/apis/magazine';
import { IMAGE_URL } from '@/apis/urls';

const imageSliderWrapStyle = css`
  position: relative;

  .image {
    width: 100vw;
    height: 100vw;
  }

  .prev-icon {
    position: absolute;
    top: 10px;
    left: 10px;
    cursor: pointer;
    width: 32px;
    height: 32px;
  }

  .swiper-pagination-bullet-active {
    background-color: #fff;
  }
`;

const productInfoStyle = css`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;

  .image {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      content: '';
      background-color: rgba(0, 0, 0, 0.04);
    }
  }

  .info-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;

    .item {
      &-name {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        max-height: 36px;
        font-size: 14px;
        line-height: 18px;
        height: auto;
      }

      &-price {
        display: inline-block;
        font-size: 16px;
        font-family: 'Gmarket Sans';
        line-height: 22px;
        color: #000;
        font-weight: 700;

        &-unit {
          display: inline-block;
          font-size: 14px;
          line-height: 20px;
          vertical-align: bottom;
        }
      }
    }
  }
`;

const contentWrapStyle = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;

  .button-box {
    display: flex;
    gap: 12px;

    > svg {
      width: 28px;
      height: 28px;
    }

    .share-icon {
      margin-left: auto;
    }
  }

  .comment-box {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;

    .comment {
      display: flex;
      align-items: center;
      gap: 8px;

      &-user {
        font-family: Gmarket Sans;
        font-weight: 500;
      }
    }
  }

  .like-text {
    font-family: Gmarket Sans;
  }

  .comment-text {
    color: #8e8e8e;
  }
`;
const commentWrapStyle = css`
  display: flex;
  gap: 8px;
  padding: 8px;

  .profile-image {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  .comment-input {
    background-color: #fff;
    outline: none;
    width: 100%;
  }
`;

const MagazineDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const setTitle = useSetAtom(titleAtom);

  const [data, setData] = useState<{
    magazine: {
      likedCnt: number;
      magazineContent: string | ReactNode;
      photoUrls: string[];
    } | null;
    goods: {
      goodsPageUrl: string;
      goodsPhotoUrl: string;
      goodsName: string;
      goodsPrice: number;
    }[];
    isLike: boolean;
  }>({
    magazine: null,
    goods: [],
    isLike: false,
  });

  const { magazine, goods, isLike } = data;
  const { likedCnt, magazineContent, photoUrls = [] } = magazine || {};
  const { goodsPageUrl, goodsPhotoUrl, goodsPrice, goodsName } = goods[0] || {};
  const LinkIcon = isLike ? IoMdHeart : IoMdHeartEmpty;

  const handleToggleLike = () => {
    setData((prev) => ({ ...prev, isLike: !isLike }));
  };

  const handlePrev = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (!id) return;
    const fetchGetMagazineDetail = async () => {
      const { success, message, data } = await getMagazineDetail(id);
      if (!success) {
        alert(message);
        return;
      }
      setData(data);
    };
    fetchGetMagazineDetail();
  }, [id]);

  useEffect(() => {
    setTitle('매거진 상세');
  }, [setTitle]);

  return (
    <div>
      <div css={imageSliderWrapStyle}>
        <IoIosArrowBack
          className="prev-icon"
          fill="#fff"
          onClick={handlePrev}
        />
        <Swiper pagination modules={[Pagination]}>
          {photoUrls.map((imageUrl, i) => (
            <SwiperSlide key={imageUrl}>
              <img
                src={IMAGE_URL + imageUrl}
                alt={`${i + 1}번째 이미지`}
                className="image"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <Link to={goodsPageUrl}>
        <div css={productInfoStyle}>
          <div className="image">
            {goodsPhotoUrl && (
              <img src={IMAGE_URL + goodsPhotoUrl} alt="상품 이미지" />
            )}
          </div>
          <div className="info-box">
            <p className="item-price">
              {goodsPrice?.toLocaleString()}
              <span className="item-price-unit">원</span>
            </p>
            <p className="item-name">{goodsName}</p>
          </div>
        </div>
      </Link>
      <div css={contentWrapStyle}>
        <div className="button-box">
          <LinkIcon onClick={handleToggleLike} />
          <LiaCommentDots />
          <GoShareAndroid className="share-icon" />
        </div>
        <p className="like-text">
          좋아요 <strong>{likedCnt}</strong>개
        </p>
        <p className="content">{magazineContent}</p>
        <div className="comment-box">
          <div className="comment">
            <span className="comment-user">지후니</span>
            <span className="comment-content">귀여워요 ^^</span>
          </div>
        </div>
        <p className="comment-text">댓글 13개 모두 보기</p>
      </div>
      <div css={commentWrapStyle}>
        <img
          src="https://cdn.hankooki.com/news/photo/202311/118934_162711_1700520953.jpg"
          alt=""
          className="profile-image"
        />
        <input className="comment-input" placeholder="댓글 남기기.." />
      </div>
    </div>
  );
};

export default MagazineDetail;
