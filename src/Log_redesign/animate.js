import { gsap, Linear } from "gsap"
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

export const moveCircle = elem => {
    var tl = gsap.timeline({ repeat: -1, repeatDelay: 0, yoyo: true });
    // tl.to(elem, {
    //     duration: 5,
    //     repeat: 12,
    //     repeatDelay: 3,
    //     yoyo: true,
    //     motionPath: {
    //         path: "#path",
    //         align: "#path",
    //         autoRotate: true,
    //         alignOrigin: [0.5, 0.5]
    //     }
    // }
    // );

    tl.to(elem, {
        x: 0,
        y: 10,
    });
    tl.to(elem, {
        x: 10,
        y: 10,
    });
    tl.to(elem, {
        x: 10,
        y: 10,
    });
    tl.to(elem, {
        x: 10,
        y: 0,
    });
    tl.to(elem, {
        x: 0,
        y: 0,
    });
};