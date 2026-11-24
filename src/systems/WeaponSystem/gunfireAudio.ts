const GUNFIRE_WAV = "data:audio/wav;base64,UklGRk8FAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YSsFAABgQ6A5j3M9kD6HSE2K1Vhste+ujvdT439mYYLcbLK7jKpWVG2+kHypkXbItmedk82yZtlFdqxFfC6Vo4GyU5B/e2SismOAHYR7spU+TnsSWSkhGIokN0+cHlproJefRFtUp7Q3PUdJcoNTLW9piMafhpeiRce2xryAglioVFZtZ4FYUWliiFjVr2t6h4pn0eWYmmBig3jIaFPWmGGYTpPSwKdpdlmsiKlqWanArKSkmFB3YDEwUk6HqmSlq6ZWQkI+P3eakmJ5jC56m4qGZD2MUo+mXF6kiUM+Q6OYRZ2xiWR/Sz63kIG2ebCsYWhuaZRtgWDAfYqawojFk5iXXI5xXLtxlLKeg5qeuWqfe362l52zxI6gk5Sni5SMwKS3vXCQuq5fXH9VZlOTnqpYlI1Uo6tap2t0qJdPa3NgUFyGPHRnOlt5bT6diJtCUzyHVEVklYxUSZZ1gUVCgWhGnH+PSpZKmHFnfaFiVn1iV11TYm5umW6CZXZYb1mdjGyHsmeohYyrg46fu4Guo5yIg2pxbKd9dW6ws6F/fICOdIx9uLmUerd/gmSDi410jGJ4aIFjYXhyjYiakZWienWoZZKLW5mdh4+UX317k5CSf5aFhWJSWWtWjXl+fYByTYiEcnV+UYJfUmCBXIKTcWlwf4R7fVRZYYNmeVJVZICCgWd4dHVdkmSZlll4j5p4bWmaaoNngJxolYCajnGcgWVkg4F5b3x7m2iWnHCilaF8gYKoj4GGfXBzn3+lfX6MeoSmop6TpKWOmHKZiJqTgHKjdomBgJekfZJ/jIN3d3meh3mdoYR0dnF+cHh4h5iQf3+DfHpsdphugIaScnRzenyUjo9mZoaPe4Bkd4+Ki5BvaGp7gY2DgIR3e2SFbIp/b2dtfoBnZXl7c2t8Ym92in6Hd2xtioBwZHh/dW5/iW1mcnaAbYSCem6Mc4ZwcIRzjHtvcXmBjG94co5wbW16jIuGkI15dI6Hb4V8fHp1b3l8kHSQeH2MjIBzgX6QeX+PdICNjHV1dpF9i5CAfpKIfouAfnaMkYmSd36Ek5KCf4OFkn2OjI6NiICAgY16fox/enmHgJKPkoB7e4WKg3+DiImLjYl8jYCGgYp+f398jYaAgY+EfoqHj3uCiouMeX97fI2EjICKgX2Ii3qDhHx/enx9g4R7d36Ee317hoF4eX+Bgnl6g398fYh9gH1+hoh9eoN6d4Z+hH6Ffnl3gICFeIB9f3l7f4V4foKFenmEhX53hH2DgIJ5gXp9goJ5en1+fHl6gIN4f4F4gnl/f4B7fX99gH19eH9+e4CAfnp+eXp9eX1+eYB5gIB+eX59gnqBg4CBe4J+goJ7gIJ6fYB7gXyBe3+CfHx/fXp8fIKAgXyAfH+AfoF/gIF8goB+gH2CgH6Af32AfIF+gIKAgH58fH2Af4CBfX6AfXx/fX9+gIB+gIB+gX5+foCBgH9/fYCAf4CAgYB/gX6AgH9+gH6AgX5/gICAgX9/f36BgIB+gYCAgIB/f39/gICAgYCAgICAgICAgX+Bf4CAgIGAgICAgIGAgICBgICAgICAgICAgICAgH+AgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIA=";

const shots_pool = typeof Audio === "undefined"
    ? []
    : Array.from({ length: 4 }, () => {
        const shot_audio = new Audio(GUNFIRE_WAV);
        shot_audio.preload = "auto";
        shot_audio.volume = 0.4;
        return shot_audio;
    });

let nextShot = 0;

export function playGunfireSound() {
    const current_shot = shots_pool[nextShot];
    if (!current_shot) return;

    nextShot = (nextShot + 1) % shots_pool.length;
    current_shot.currentTime = 0;
    void current_shot.play().catch(() => undefined);
}
