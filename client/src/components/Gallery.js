import React from 'react';
import Slider from "react-slick";

const Gallery = (props) => {
    const options = {
        dots: false,
        infinite: false,
        swipeToSlide: true,
        variableWidth: true
    };
    let { path, images } = props;

    return (
        <Slider {...options} className="gallery">
            {images.map(image => {
                return (
                    <div className="gallery-item" key={image}><img src={`${path}/${image}`} alt=""/></div>
                )
            })}
        </Slider>
    )
};

export default Gallery