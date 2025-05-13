import './HomePage.css'

function HomePage() {

  return (
    <>
      <div className='container'>
        <p className='container_p-moto'>Менше шукай, більше мандруй</p>
        <div className='container_search-block'>
          <input type="text" className='input-field' placeholder="Шукай туристичні місця" />
          <button className="search-button">Шукати</button>
        </div>
        <button class="container_button-go-to-list">Перейти до публікацій</button>
      </div>
    </>
  )
}


export default HomePage
