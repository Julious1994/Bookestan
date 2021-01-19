export const initialState = {
	token: null,
	user: null,
	defaultcar: null,
	drawer: false,
	notification: null,
	loading: false,
	cart: [],
	likes: [],
	purchasedBooks: [],
	listenedBooks: [],
};

export const reducer = (state, action) => {
	switch (action.type) {
		case 'setToken':
			return {
				...state,
				token: action.token,
			};
		case 'SET_USER':
			return {
				...state,
				user: action.userData,
			};
		case 'setCredential':
			return {
				...state,
				...action.credential,
				credential: { ...action.credential },
			};
		case 'TOGGELE_DRAWER':
			return {
				...state,
				drawer: !state.drawer,
			};
		case 'Notification':
			return {
				...state,
				notification: action.notification,
			};
		case 'SET_LIKES':
			return {
				...state,
				likes: [...action.data],
			};
		case 'ADD_LIKE':
			return {
				...state,
				likes: [...state.likes, { ...action.data }],
			};
		case 'REMOVE_LIKE':
			let list = [...state.likes];
			const index = state.likes.findIndex(l => l.BookID === action.data.BookID);
			if (index !== -1) {
				list.splice(index, 1);
			}
			return {
				...state,
				likes: [...list],
			};
		case 'SET_LOADING':
			return {
				...state,
				loading: action.loading,
			};
		case 'ADD_CART':
			return {
				...state,
				cart: [...state.cart, { ...action.payload }],
			};
		case 'SET_CART':
			return {
				...state,
				cart: [...action.payload],
			};
		case 'REMOVE_CART':
			const newCart = state.cart.filter((c, i) => i !== action.index);
			return {
				...state,
				cart: [...newCart],
			};
		case 'SET_PURCHASED':
			return {
				...state,
				purchasedBooks: [...action.data],
			};
		case 'SET_LISTENED':
			return {
				...state,
				listenedBooks: [...action.data],
			};
		case 'CHANGE_CART':
		default:
			return state;
	}
};
