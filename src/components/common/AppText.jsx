import React from 'react';
import { Text as RNText } from "react-native";
import { COLORS, TYPOGRAPHY } from "../../utils/theme";
import { ms } from '../../utils/responsive';

import { useTheme } from '../../context/ThemeContext';

const BaseText = React.forwardRef(({ children, style, ...props }, ref) => {
    return (
        <RNText ref={ref} allowFontScaling={false} style={style} {...props}>
            {children}
        </RNText>
    );
});

const AppText = {
    h1: React.forwardRef((props, ref) => {
        const { theme } = useTheme();
        return <BaseText {...props} ref={ref} style={[TYPOGRAPHY.h1, { color: theme.colors.text }, props.style]} />;
    }),
    h2: React.forwardRef((props, ref) => {
        const { theme } = useTheme();
        return <BaseText {...props} ref={ref} style={[TYPOGRAPHY.h2, { color: theme.colors.text }, props.style]} />;
    }),
    h3: React.forwardRef((props, ref) => {
        const { theme } = useTheme();
        return <BaseText {...props} ref={ref} style={[TYPOGRAPHY.h2, { fontSize: ms(18) }, { color: theme.colors.text }, props.style]} />;
    }),
    body: React.forwardRef((props, ref) => {
        const { theme } = useTheme();
        return <BaseText {...props} ref={ref} style={[TYPOGRAPHY.body, { color: theme.colors.text }, props.style]} />;
    }),
    small: React.forwardRef((props, ref) => {
        const { theme } = useTheme();
        return <BaseText {...props} ref={ref} style={[TYPOGRAPHY.subtext, { fontSize: ms(12) }, { color: theme.colors.subtext }, props.style]} />;
    }),
    medium: React.forwardRef((props, ref) => {
        const { theme } = useTheme();
        return <BaseText {...props} ref={ref} style={[TYPOGRAPHY.subtext, { color: theme.colors.primary, fontWeight: '600' }, props.style]} />;
    }),
};

export default AppText;