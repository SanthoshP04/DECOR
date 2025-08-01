import React, { memo, useState } from 'react';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

const CategoryFilterItem = memo((props) => {
    const { 
        categories,
        categoryActiveIndex,
        isCategory,
        setIsCategory,
        setCategory,
        setCategoryActiveIndex 
    } = props;

    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleCategory = (category, index) => {
        // Fixed logic: if clicking the same category that's already active, deactivate it
        if (categoryActiveIndex === index && isCategory) {
            setIsCategory(false);
            setCategoryActiveIndex(null);
            setCategory("");
        } else {
            // Otherwise, activate the new category
            setIsCategory(true);
            setCategoryActiveIndex(index);
            setCategory(category);
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Enhanced Label with Icon */}
            <Form.Label 
                className="font-20 fw-bold text-primary-color d-flex align-items-center mb-3"
                style={{
                    background: 'linear-gradient(135deg, #0d6efd, #6610f2)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textDecoration: 'none',
                    position: 'relative',
                    animation: 'fadeInDown 0.6s ease-out'
                }}
            >
                <span 
                    style={{
                        marginRight: '8px',
                        fontSize: '1.2em',
                        animation: 'bounce 2s infinite'
                    }}
                >
                    📂
                </span>
                Category
                <div 
                    style={{
                        position: 'absolute',
                        bottom: '-2px',
                        left: '0',
                        width: '100%',
                        height: '2px',
                        background: 'linear-gradient(90deg, #0d6efd, #6610f2)',
                        borderRadius: '1px',
                        animation: 'slideInLeft 0.8s ease-out'
                    }}
                />
            </Form.Label>

            <ListGroup 
                as="ul" 
                style={{
                    animation: 'fadeInUp 0.8s ease-out'
                }}
            >
                {categories.map((category, index) => (
                    <ListGroup.Item
                        key={index}
                        as="li"
                        className={`font-lato border-0 cursor-pointer py-2 px-3 ${
                            categoryActiveIndex === index ? 'fw-bold' : ''
                        }`}
                        onClick={() => handleCategory(category, index)}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{
                            backgroundColor: categoryActiveIndex === index 
                                ? 'rgba(13, 110, 253, 0.1)' 
                                : hoveredIndex === index 
                                    ? 'rgba(13, 110, 253, 0.05)' 
                                    : 'transparent',
                            color: categoryActiveIndex === index 
                                ? '#0d6efd' 
                                : hoveredIndex === index 
                                    ? '#495057' 
                                    : '#6c757d',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            borderRadius: '8px',
                            margin: '2px 0',
                            position: 'relative',
                            overflow: 'hidden',
                            transform: hoveredIndex === index ? 'translateX(8px)' : 'translateX(0)',
                            boxShadow: categoryActiveIndex === index 
                                ? '0 4px 12px rgba(13, 110, 253, 0.2)' 
                                : hoveredIndex === index 
                                    ? '0 2px 8px rgba(0, 0, 0, 0.1)' 
                                    : 'none',
                            animationDelay: `${index * 0.1}s`,
                            animation: 'slideInRight 0.6s ease-out both'
                        }}
                    >
                        {/* Active indicator */}
                        {categoryActiveIndex === index && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: '0',
                                    top: '0',
                                    bottom: '0',
                                    width: '4px',
                                    background: 'linear-gradient(180deg, #0d6efd, #6610f2)',
                                    animation: 'expandHeight 0.3s ease-out'
                                }}
                            />
                        )}

                        {/* Hover ripple effect */}
                        {hoveredIndex === index && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    width: '100%',
                                    height: '100%',
                                    background: 'radial-gradient(circle, rgba(13, 110, 253, 0.1) 0%, transparent 70%)',
                                    transform: 'translate(-50%, -50%)',
                                    borderRadius: '50%',
                                    animation: 'ripple 0.6s ease-out'
                                }}
                            />
                        )}

                        {/* Category text with icon */}
                        <div className="d-flex align-items-center">
                            <span 
                                style={{
                                    marginRight: '8px',
                                    opacity: categoryActiveIndex === index ? '1' : '0.7',
                                    transition: 'opacity 0.3s ease',
                                    fontSize: '0.9em'
                                }}
                            >
                                {getCategoryIcon(category)}
                            </span>
                            <span
                                style={{
                                    position: 'relative',
                                    zIndex: 1
                                }}
                            >
                                {category}
                            </span>
                            {categoryActiveIndex === index && (
                                <span 
                                    style={{
                                        marginLeft: 'auto',
                                        color: '#0d6efd',
                                        fontSize: '0.8em',
                                        animation: 'checkmark 0.5s ease-out'
                                    }}
                                >
                                    ✓
                                </span>
                            )}
                        </div>

                        {/* Shimmer effect for active item */}
                        {categoryActiveIndex === index && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '0',
                                    left: '-100%',
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                                    animation: 'shimmer 2s infinite'
                                }}
                            />
                        )}
                    </ListGroup.Item>
                ))}
            </ListGroup>

            {/* Custom CSS animations */}
            <style jsx>{`
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInLeft {
                    from {
                        width: 0;
                    }
                    to {
                        width: 100%;
                    }
                }

                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {
                        transform: translateY(0);
                    }
                    40% {
                        transform: translateY(-10px);
                    }
                    60% {
                        transform: translateY(-5px);
                    }
                }

                @keyframes ripple {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(2);
                        opacity: 0;
                    }
                }

                @keyframes expandHeight {
                    from {
                        height: 0;
                    }
                    to {
                        height: 100%;
                    }
                }

                @keyframes checkmark {
                    0% {
                        transform: scale(0) rotate(0deg);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.2) rotate(180deg);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1) rotate(360deg);
                        opacity: 1;
                    }
                }

                @keyframes shimmer {
                    0% {
                        left: -100%;
                    }
                    100% {
                        left: 100%;
                    }
                }

                .cursor-pointer {
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
});

// Helper function to get category icons
const getCategoryIcon = (category) => {
    const icons = {
        "Sofas": "🛋️",
        "Beds": "🛏️",
        "Wardrobes": "👔",
        "Dressing Tables": "💄",
        "Dining Tables": "🍽️",
        "Study Tables": "📚",
        "Chairs": "🪑",
        "TV and Media Units": "📺"
    };
    return icons[category] || "🏠";
};

export default CategoryFilterItem;


// import React, { memo } from 'react';
// import Form from 'react-bootstrap/Form';
// import ListGroup from 'react-bootstrap/ListGroup';

// const CategoryFilterItem = memo((props) => {

//     const { categories, categoryActiveIndex, isCategory, setIsCategory, setCategory, setCategoryActiveIndex } = props;

//     // Category filter handler
//     const handleCategory = (category, index) => {
//         setIsCategory(!isCategory);
//         setCategoryActiveIndex(!isCategory ? "" : index);
//         setCategory(!isCategory ? "" : category);
//     };

//     return (
//         <>
//             <Form.Label className="font-20 fw-bold text-primary-color text-decoration-underline">Category</Form.Label>
//             <ListGroup as="ul">
//                 {
//                     categories.map((category, index) => {
//                         return (
//                             <ListGroup.Item key={index} as="li" className={`font-lato text-gray-500-color border-0 cursor-pointer py-1 px-0 ${categoryActiveIndex === index ? 'fw-bold' : ''}`} onClick={() => handleCategory(category, index)}>{category}</ListGroup.Item>
//                         )
//                     })
//                 }
//             </ListGroup>
//         </>
//     )
// });

// export default CategoryFilterItem;
