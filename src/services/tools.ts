export function toSeconds(time_str: any) {
    var parts = time_str.split(':');
    // compute  and return total seconds
    return parts[0] * 3600 + // an hour has 3600 seconds
        parts[1] * 60 + // a minute has 60 seconds
        +
        parts[2]; // seconds
}
