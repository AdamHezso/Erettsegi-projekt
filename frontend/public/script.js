function nextPic() {
    let carousel = document.querySelector('#carouselExampleIndicators');
    let carouselInstance = bootstrap.Carousel.getInstance(carousel);
    carouselInstance.next();
}