import React from 'react';
import { Text as RNText, StyleSheet } from "react-native";
import { COLORS, TYPOGRAPHY } from "../../utils/theme";
import { ms } from '../../utils/responsive';

const BaseText = React.forwardRef(({ children, style, ...props }, ref) => {
    return (
        <RNText ref={ref} allowFontScaling={false} style={style} {...props}>
            {children}
        </RNText>
    );
});

const styles = StyleSheet.create({
    h1: {
        ...TYPOGRAPHY.h1,
    },
    h2: {
        ...TYPOGRAPHY.h2,
    },
    h3: {
        ...TYPOGRAPHY.h2,
        fontSize: ms(18),
    },
    body: {
        ...TYPOGRAPHY.body,
    },
    small: {
        ...TYPOGRAPHY.subtext,
        fontSize: ms(12),
    },
    medium: {
        ...TYPOGRAPHY.subtext,
        color: "#1642B2",
        fontWeight: '600',
    },
});

const AppText = {
    h1: React.forwardRef((props, ref) => {
        return <BaseText {...props} ref={ref} style={[styles.h1, { color: COLORS.text }, props.style]} />;
    }),
    h2: React.forwardRef((props, ref) => {
        return <BaseText {...props} ref={ref} style={[styles.h2, { color: COLORS.text }, props.style]} />;
    }),
    h3: React.forwardRef((props, ref) => {
        return <BaseText {...props} ref={ref} style={[styles.h3, { color: COLORS.text }, props.style]} />;
    }),
    body: React.forwardRef((props, ref) => {
        return <BaseText {...props} ref={ref} style={[styles.body, { color: COLORS.text }, props.style]} />;
    }),
    small: React.forwardRef((props, ref) => {
        return <BaseText {...props} ref={ref} style={[styles.small, { color: COLORS.subtext }, props.style]} />;
    }),
    medium: React.forwardRef((props, ref) => {
        return <BaseText {...props} ref={ref} style={[styles.medium, props.style]} />;
    }),
};

export default AppText;