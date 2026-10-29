import React from "react";

interface BlackTicketMyIconProps {
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Tilted Standalone Black 'my' Ticket Emblem
 * Features an exact 3-pixel white protective border covering all sides of the SVG ticket contour.
 * Centered and tilted at -8 degrees.
 */
export function BlackTicketMyIcon({
  className = "w-9 h-6",
  width,
  height,
}: BlackTicketMyIconProps) {
  const ticketPath =
    "M -69.50 -50.00 H -52.33 A 6.00 6.00 0 0 0 -40.33 -50.00 H -6.00 A 6.00 6.00 0 0 0 6.00 -50.00 H 40.33 A 6.00 6.00 0 0 0 52.33 -50.00 H 69.50 A 8.00 8.00 0 0 1 77.50 -42.00 V -13.00 A 13.00 13.00 0 0 0 77.50 13.00 V 42.00 A 8.00 8.00 0 0 1 69.50 50.00 H 52.33 A 6.00 6.00 0 0 0 40.33 50.00 H 6.00 A 6.00 6.00 0 0 0 -6.00 50.00 H -40.33 A 6.00 6.00 0 0 0 -52.33 50.00 H -69.50 A 8.00 8.00 0 0 1 -77.50 42.00 V 13.00 A 13.00 13.00 0 0 0 -77.50 -13.00 V -42.00 A 8.00 8.00 0 0 1 -69.50 -50.00 Z";

  return (
    <svg
      viewBox="-95 -70 190 140"
      width={width}
      height={height}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="GetMyShow Ticket Emblem"
      style={{
        filter:
          "drop-shadow(2px 0 0 #FFFFFF) drop-shadow(-2px 0 0 #FFFFFF) drop-shadow(0 2px 0 #FFFFFF) drop-shadow(0 -2px 0 #FFFFFF) drop-shadow(1.5px 1.5px 0 #FFFFFF) drop-shadow(-1.5px 1.5px 0 #FFFFFF) drop-shadow(1.5px -1.5px 0 #FFFFFF) drop-shadow(-1.5px -1.5px 0 #FFFFFF)",
      }}
    >
      <g transform="rotate(-8)">
        {/* Layer 1: Solid White Halo Mask / Stroke covering 3px on all outer sides */}
        <path
          d={ticketPath}
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth="16"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Layer 2: Pitch Black Ticket Body */}
        <path
          d={ticketPath}
          fill="#000000"
        />

        {/* Layer 3: White Perforation Dashed Line */}
        <line
          x1="-46.33"
          y1="-42.0"
          x2="-46.33"
          y2="42.0"
          stroke="#FFFFFF"
          strokeOpacity="0.45"
          strokeWidth="2.5"
          strokeDasharray="4.5 4"
          strokeLinecap="round"
        />

        {/* Layer 4: White 'm' glyph */}
        <path
          fill="#FFFFFF"
          d="M1430 0V590Q1430 664 1403.5 700.5Q1377 737 1317 737Q1258 737 1225.0 692.5Q1192 648 1192 569V0H766V580Q766 737 659 737Q594 737 561.0 691.5Q528 646 528 561V0H102V1024H528V862H532Q556 905 608.5 949.5Q661 994 727.0 1021.5Q793 1049 870 1049Q979 1049 1053.5 1006.0Q1128 963 1178 870Q1232 956 1322.0 1002.5Q1412 1049 1522 1049Q1683 1049 1769.0 944.0Q1855 839 1855 641V0Z"
          transform="translate(-32,14) scale(0.0234,-0.0234)"
        />

        {/* Layer 5: White 'y' glyph */}
        <path
          fill="#FFFFFF"
          d="M301 -481Q241 -481 172.0 -470.5Q103 -460 49 -440V-119Q74 -138 123.5 -154.0Q173 -170 217 -170Q336 -170 375 -76L408 4L-20 1024H451L575 530Q611 392 614 344H618Q621 366 626.5 393.0Q632 420 782 1024H1196L819 -29Q734 -271 608.5 -376.0Q483 -481 301 -481Z"
          transform="translate(13.61,14) scale(0.0234,-0.0234)"
        />

        {/* Layer 6: Sunset Saffron play arrow */}
        <path d="M 46 -7 L 56 0 L 46 7 Z" fill="#F97316" />
      </g>
    </svg>
  );
}

export default BlackTicketMyIcon;
