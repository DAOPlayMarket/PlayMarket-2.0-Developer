const categories = [
    {
        id: 1,
        name: 'apps',
        subcategories: [
            {
                id: 1,
                name: 'cryptocurrency'
            },
            {
                id: 2,
                name: 'auto and vehicles'
            },
            {
                id: 3,
                name: 'business'
            },
            {
                id: 4,
                name: 'video players'
            },
            {
                id: 5,
                name: 'food and drink'
            },
            {
                id: 6,
                name: 'house and home'
            },
            {
                id: 7,
                name: 'health and fitness'
            },
            {
                id: 8,
                name: 'dating'
            },
            {
                id: 9,
                name: 'tools'
            },
            {
                id: 10,
                name: 'art and design'
            },
            {
                id: 11,
                name: 'maps and navigation'
            },
            {
                id: 12,
                name: 'books and reference'
            },
            {
                id: 13,
                name: 'comics'
            },
            {
                id: 14,
                name: 'beauty'
            },
            {
                id: 15,
                name: 'parenting'
            },
            {
                id: 16,
                name: 'medical'
            },
            {
                id: 17,
                name: 'events'
            },
            {
                id: 18,
                name: 'music and audio'
            },
            {
                id: 19,
                name: 'news and magazines'
            },
            {
                id: 20,
                name: 'education'
            },
            {
                id: 21,
                name: 'personalization'
            },
            {
                id: 22,
                name: 'weather'
            },
            {
                id: 23,
                name: 'shopping'
            },
            {
                id: 24,
                name: 'travel and local'
            },
            {
                id: 25,
                name: 'productivity'
            },
            {
                id: 26,
                name: 'entertainment'
            },
            {
                id: 27,
                name: 'communication'
            },
            {
                id: 28,
                name: 'social'
            },
            {
                id: 29,
                name: 'sports'
            },
            {
                id: 30,
                name: 'lifestyle'
            },
            {
                id: 31,
                name: 'finance'
            },
            {
                id: 32,
                name: 'photography'
            }
        ]
    },
    {
        id: 2,
        name: 'games',
        subcategories: [
            {
                id: 1,
                name: 'arcade'
            },
            {
                id: 2,
                name: 'trivia'
            },
            {
                id: 3,
                name: 'puzzle'
            },
            {
                id: 4,
                name: 'racing'
            },
            {
                id: 5,
                name: 'casino'
            },
            {
                id: 6,
                name: 'casual'
            },
            {
                id: 7,
                name: 'card'
            },
            {
                id: 8,
                name: 'music'
            },
            {
                id: 9,
                name: 'board'
            },
            {
                id: 10,
                name: 'educational'
            },
            {
                id: 11,
                name: 'adventure'
            },
            {
                id: 12,
                name: 'role playing'
            },
            {
                id: 13,
                name: 'simulation'
            },
            {
                id: 14,
                name: 'word'
            },
            {
                id: 15,
                name: 'sports'
            },
            {
                id: 16,
                name: 'strategy'
            },
            {
                id: 17,
                name: 'action'
            }
        ]
    }
];

const getAll = () => {
    return categories;
};
const getCategory = (idCTG) => {
    return categories.find(item => item.id === parseInt(idCTG));
};
const getCategories = () => {
    return categories;
};
const getSubCategory = (subcategories, subCategory) => {
    return subcategories.find(item => item.id === parseInt(subCategory));
};

module.exports = {
    getAll: getAll,
    getCategories: getCategories,
    getCategory: getCategory,
    getSubCategory: getSubCategory
};