import React from 'react';
import Slider from "react-slick";

const Gallery = (props) => {
    const options = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    let { path, images } = props;

    return (
        <Slider {...options}>
            {images.map(image => {
                return (
                    <div key={image}><img src={path + '/' + image} alt=""/></div>
                )
            })}
        </Slider>
    )
};

export default Gallery