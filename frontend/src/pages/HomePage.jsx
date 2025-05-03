import './HomePage.css'

function HomePage() {

  return (
    <>
      <div className='container'>
        <p className='container_p-moto'>Менше шукай, більше мандруй</p>
        <div className='container_search-block'>
          <input type="text" className='input-field' placeholder="Шукай туристичні місця" />
          <button class="search-button">Шукати</button>
        </div>
      </div>
    </>
  )
}


export default HomePage
