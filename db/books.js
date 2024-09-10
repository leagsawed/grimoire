const books = [
  {
    userId: '123', // identifiant MongoDB unique de l'utilisateur qui a créé le livre
    title: 'Le seigneur des anneaux', // titre du livre
    author: 'J.R.R. Tolkien', // auteur du livre
    imageUrl: 'https://image.com  ', // illustration/couverture du livre
    year: 1954, // année de publication du livre
    genre: 'fiction', // genre du livre
    ratings: [
      {
        userId: '123', // identifiant MongoDB unique de l'utilisateur qui a noté le livre
        grade: 4, // note donnée à un livre
      },
    ],
    averageRating: 4, // note moyenne du livre
  },
];

module.exports = { books };
