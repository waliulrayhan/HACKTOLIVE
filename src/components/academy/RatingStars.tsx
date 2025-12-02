"use client";

import { HStack, Icon } from "@chakra-ui/react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: string;
  color?: string;
}

export default function RatingStars({
  rating,
  maxRating = 5,
  size = "16px",
  color = "#F59E0B",
}: RatingStarsProps) {
  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    if (rating >= i) {
      // Full star
      stars.push(<Icon key={i} as={FaStar} color={color} boxSize={size} />);
    } else if (rating >= i - 0.5) {
      // Half star
      stars.push(<Icon key={i} as={FaStarHalfAlt} color={color} boxSize={size} />);
    } else {
      // Empty star
      stars.push(<Icon key={i} as={FaRegStar} color={color} boxSize={size} />);
    }
  }

  return <HStack spacing="1">{stars}</HStack>;
}
