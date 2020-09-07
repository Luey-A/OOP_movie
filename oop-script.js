//the API documentation site https://developers.themoviedb.org/3/

class App {
    static async run() {
        const movies = await APIService.fetchMovies()
        HomePage.renderMovies(movies);
    }
}

class ActorsNavbar {
    static async run() {
        const Actors = await APIService.fetchActors()
        // const movies2= await APIService.genreDictionary()
        ActorListPage.renderActors(Actors);
        // ActorListPage.renderActors(actors);
    }
}

class APIService {
    static TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    static async fetchMovies() {
        const url = APIService._constructUrl(`movie/now_playing`)
        const response = await fetch(url)
        const data = await response.json()

        // console.log(data)
        return data.results.map(movie => new Movie(movie))
    }

    static async fetchCredits(movie_id) {
        const url = APIService._constructUrl(`movie/${movie_id}/credits`)
        const response = await fetch(url)
        const data = await response.json()
        // console.log(data)
        return data.cast.slice(0,5).map(actor => new Actor(actor))
    }
    static async fetchDirector(movie_id) {
      const url = APIService._constructUrl(`movie/${movie_id}/credits`)
      const response = await fetch(url)
      const data = await response.json()
      // console.log(data)
      // const directorData= data.crew.find(x => x.job=="Director")
      return data.crew.find(x => x.job=="Director")
      // console.log(directorData)
  }    
        
    static async fetchActors(movie_id) {
        const url = APIService._constructUrl(`person/${person_id}`)
        const response = await fetch(url)
        const data = await response.json()
        // console.log(data);
        return data
    }

    static async fetchRelatedMvoies(movie_id){        
      const url = APIService._constructUrl(`movie/${movie_id}/similar`)
      const response = await fetch(url)
      const data = await response.json()
      // console.log(data) 
      return data.results.slice(0,5).map(movie => new Movie(movie))
    
    }
    static async fetchTrailers(movie_id){
      const url = APIService._constructUrl(`movie/${movie_id}/videos`)
      const response = await fetch(url);
      const trailer = await response.json();
      return trailer.results.map(movie => new Trailers(movie))
      // console.log (trailer)

    }



    static async fetchMovie(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}`)
        const response = await fetch(url)
        const data = await response.json()
        // console.log(data)
        return new Movie(data)
    
    }

    static _constructUrl(path) {
        return `${this.TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`;
    }
} 

class HomePage {
    static container = document.getElementById('container');
    static renderMovies(movies) {
        movies.forEach(movie => {
            const movieDiv = document.createElement("div");
            const movieImage = document.createElement("img");
            movieImage.src = `${movie.backdropUrl}`;
            const movieTitle = document.createElement("h3");
            movieTitle.textContent = `${movie.title}`;
            movieImage.addEventListener("click", function() {
                Movies.run(movie);//this goes to movies class and brings movie.idm movie data+
            });

            movieDiv.appendChild(movieTitle);
            movieDiv.appendChild(movieImage);
            this.container.appendChild(movieDiv);
        })
    }
}

//class for actors to move to the single actor HomePage
class ActorListPage {
    static container = document.getElementById('container');
    static renderActors(actors) {
        actors.forEach(actor => {
            const actorDiv = document.createElement("div");
            const actorImage = document.createElement("img");
            actorImage.src = `${actor.backdropUrl}`;
            const actorTitle = document.createElement("h3");
            actorTitle.textContent = `${actor.title}`;
            actorImage.addEventListener("click", function() {
                actors.run(actor);//this goes to movies class and brings movie.idm movie data+
            });

            actorDiv.appendChild(actorTitle);
            actorDiv.appendChild(actorImage);
            this.container.appendChild(actorDiv);
        })
    }
}

class Movies {
    static async run(movie) {
        const movieData = await APIService.fetchMovie(movie.id)
        const castData= await APIService.fetchCredits(movie.id)
        const relatedMovies=await APIService.fetchRelatedMvoies(movie.id)
        const movieTrialers=await APIService.fetchTrailers(movie.id)
        const directorName=await APIService.fetchDirector(movie.id)
        // console.log(castData)
        MoviePage.renderMovieSection(movieData,castData,relatedMovies,movieTrialers,directorName);
    }
}

class MoviePage {
    static container = document.getElementById('container');
    static renderMovieSection(movie,cast,related,trailers,director) {
      MovieSection.renderMovie(movie,cast,related,trailers,director);
    }
}

class ActorPage {
    static container = document.getElementById('container');
    static renderActorSection(actor,name,photo) {
      ActorSection.renderActor(actor,name,photo);
    }
}
class MovieSection {
    static renderMovie(movie,cast,related,trailers,director) {
      // console.log(trailers)
        MoviePage.container.innerHTML = `
      <div class="row">
        <div class="col-md-4">
          <img id="movie-backdrop" src=${movie.backdropUrl}> 
        </div>
        <div class="col-md-8">
          <h2 id="movie-title">${movie.title}</h2>
          <p id="genres">${movie.genres.slice(0, -2)}</p>
          <p id="language">Languages: ${movie.language.slice(0, -2)}</p>
          <p id="movie-release-date">Release date: ${movie.releaseDate}</p>
          <p id="movie-runtime">Runtime: ${movie.runtime}</p>
          <p id="">Rate: ${movie.rating}, Vote count: ${movie.vote_count} </p>
          
          <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
      </div>
      <h5>Director Name: ${director.name}</h5>
      <h3>Actors:</h3>
      <div id="actors">
        ${cast.map(actor =>`
        <div>
          <img id="logo" src= ${actor.backdropUrl}>
          <p>${actor.name}</p>
        </div>`).join("")}
      </div>

      <h3>Production Companies:</h3>
      <div id="production_companies">
        ${movie.productionCompanies.map(m =>`
        <div>
          ${m.logo_path ? `<img src= ${Movie.BACKDROP_BASE_URL+m.logo_path}>` : ""}
          <p>${m.name}</p>
        </div>`).join("")}
      </div>
      
      <div>
      <h3> Movie Trailers:</h3>
      <iframe width="560" height="315" 
      src="https://www.youtube.com/embed/${trailers[0].key}" 
      frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>      
      </div>
 
 
    <h3>Related Movies:</h3>
      <div id="related">
        ${related.map(movie =>`
        <div>
          <img class="related" src= ${movie.backdropUrl}>
          <p>${movie.title}</p>
       </div>`
          
        ).join("")
        
       }
       </div>
     
  ` 
  console.log(movie.productionCompanies)
  }
}
class Related {
  static call(movie){
    Movies.run(movie)
  }
}
// class ActorSection {
//     static renderActor(actor,name,photo) {
//         ActorPage.container.innerHTML = `
//       <div class="row">
//         <div class="col-md-4">
//           <img id="actor-backdrop" src=${actor.backdropUrl}> 
//         </div>
//         <div class="col-md-8">
//           <h2 id="actor-name">${actor.name}</h2>
//           <p id="actor-photo">${actor.photo}</p>
//           <p id="movie-runtime">${movie.runtime}</p>
//           <h3>Overview:</h3>
//           <p id="movie-overview">${movie.overview}</p>
//         </div>
//       </div>
//       <h3>Actors:</h3>
//       <div id="actors">
//         ${cast.map(actor =>`
//         <div>
//           <img src= ${actor.backdropUrl}>
//           <p>${actor.name}</p>
//         </div>`).join("")}
//       </div>
//       <div>

//         <h3>Production Companies:</h3>
//         <p id="production_companies">${movie.productionCompanies.slice(0, -2)}</p>
//       </div>



class Movie {
  static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
    constructor(json) {
        this.id = json.id;
        this.title = json.title;
        this.name=json.name
        this.releaseDate = json.release_date;
        this.runtime = json.runtime + " minutes";
        this.overview = json.overview;
        this.backdropPath = json.backdrop_path;
        this.vote_count=json.vote_count;
        this.genres=""
        for (let i in json.genres){
          this.genres+=json.genres[i].name+", ";
        }
        this.language="";
        for (let j in json.spoken_languages){
          this.language+=json.spoken_languages[j].name+", ";
        }
        
        this.productionCompanies=json.production_companies;
        this.rating=json.vote_average;
    }

  get backdropUrl() {
      return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : "";
  }

    
}

class Rating{
  constructor(json){
    this.value=json.value;
  }
}
class Actor{
  static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
  constructor(json){
    this.name=json.name;
    this.profile=json.profile_path;
    // console.log(json);

  }

  get backdropUrl() {
    return this.profile ? Actor.BACKDROP_BASE_URL + this.profile : "";
  }  
}
class Trailers{
  constructor(json){
    this.key=json.key;
  }
}

document.addEventListener("DOMContentLoaded", App.run);
// document.body.addEventListener("onclick", function(){  
// window.onload = function() {
// document.getElementById("nav-link").addEventListener('click',changeClass);
//     }
//  } );

//  document.getElementById("nav-link").addEventListener("click", ActorsNavbar.run);
