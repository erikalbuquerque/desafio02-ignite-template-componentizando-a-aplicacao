import { ReactNode, createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

interface MovieProviderProps {
	children: ReactNode;
}

interface MovieContextProps {
	genres: GenreResponseProps[];
	movies: MovieProps[];
	selectedGenreId: number;
	selectedGenre: GenreResponseProps;
	handleSelectGenre: (id: number) => void;
}

interface GenreResponseProps {
	id: number;
	name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
	title: string;
}

interface MovieProps {
	imdbID: string;
	Title: string;
	Poster: string;
	Ratings: Array<{
		Source: string;
		Value: string;
	}>;
	Runtime: string;
}

const MovieContext = createContext({} as MovieContextProps);

export function MovieProvider({ children }: MovieProviderProps) {
	const [ genres, setGenres ] = useState<GenreResponseProps[]>([]);
	const [ selectedGenreId, setSelectedGenreId ] = useState(1);
	const [ movies, setMovies ] = useState<MovieProps[]>([]);
	const [ selectedGenre, setSelectedGenre ] = useState<GenreResponseProps>({} as GenreResponseProps);

	useEffect(
		() => {
			api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then((response) => {
				setMovies(response.data);
			});

			api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then((response) => {
				setSelectedGenre(response.data);
			});
		},
		[ selectedGenreId ]
	);

	useEffect(() => {
		api.get<GenreResponseProps[]>('genres').then((response) => {
			setGenres(response.data);
		});
	}, []);

	function handleSelectGenre(id: number) {
		setSelectedGenreId(id);
	}

	return (
		<MovieContext.Provider
			value={{
				genres,
        movies,
        selectedGenre,
				selectedGenreId,
				handleSelectGenre
			}}
		>
			{children}
		</MovieContext.Provider>
	);
}

export function useMovie() {
	const context = useContext(MovieContext);
	return context;
}
