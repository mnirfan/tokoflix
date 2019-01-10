export default {
  moviePrice (rating) {
    rating = parseFloat(rating)
    if (rating >= 8) return 21250
    else if (rating >= 6) return 16350
    else if (rating >= 3) return 8250
    else return 3500
  }
}
