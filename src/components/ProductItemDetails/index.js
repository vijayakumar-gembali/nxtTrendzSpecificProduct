import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productDetails: '',
    similarItemList: [],
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)

    const apiUrl = 'http://localhost:3000/products/16'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    console.log(response.ok)
    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = {
        title: fetchedData.title,
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        brand: fetchedData.brand,
        totalReviews: fetchedData.total_reviews,
        rating: fetchedData.rating,
        availability: fetchedData.availability,
        price: fetchedData.price,
        description: fetchedData.description,
      }

      const similarProductsData = fetchedData.similar_products.map(
        similarProduct => ({
          title: similarProduct.title,
          id: similarProduct.id,
          imageUrl: similarProduct.image_url,
          style: similarProduct.style,
          brand: similarProduct.brand,
          totalReviews: similarProduct.total_reviews,
          rating: similarProduct.rating,
          availability: similarProduct.availability,
          price: fetchedData.price,
          description: fetchedData.description,
        }),
      )
      this.setState({
        apiStatus: apiStatusConstants.success,
        productDetails: updatedData,
        similarItemList: similarProductsData,
      })
    }
    if (response.status === 401) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderProductItemDetails = () => {
    const {productDetails, similarItemList} = this.state
    const {
      imageUrl,
      title,
      brand,
      rating,
      price,
      totalReviews,
      description,
      availability,
    } = productDetails
    return (
      <>
        <Header />
        <div className="ProductItemDetails-container">
          <div>
            <img src={imageUrl} className="product-item-img" alt={brand} />
            <div>
              <h1 className="product-title">{title}</h1>
              <p className="product-price">{price}</p>
              <div className="rating-star-review-container">
                <div className="rating-star-container">
                  <p className="rating">{rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star-img"
                  />
                </div>
                <p>{totalReviews} Reviews</p>
              </div>
              <p className="description">{description}</p>
              <h1>
                Availability: <span>{availability}</span>
              </h1>
              <h1>
                Brand: <span>{brand}</span>
              </h1>
              <hr className="horizontal-line" />
            </div>
          </div>
          <div>
            <h1>Similar Products</h1>
          </div>
        </div>
      </>
    )
  }

  renderProductsRoute = () => {
    const {history} = this.props
    history.Replace('/products')
  }

  renderProductItemFailureView = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
        className="error-image"
      />
      <button type="button" onClick={this.renderProductsRoute}>
        Continue Shopping
      </button>
    </>
  )

  renderLoadingView = () => (
    <div>
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductItemDetails()
      case apiStatusConstants.failure:
        return this.renderProductItemFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default ProductItemDetails
