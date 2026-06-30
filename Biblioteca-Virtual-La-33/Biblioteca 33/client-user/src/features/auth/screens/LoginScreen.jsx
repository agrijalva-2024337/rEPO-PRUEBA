// client-user/src/features/auth/screens/LoginScreen.jsx
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth.js';
import { AuthScreenLayout } from '../components/AuthScreenLayout.jsx';
import { Button } from '../../../shared/components/common/Button.jsx';
import { Input } from '../../../shared/components/common/Input.jsx';
import { Card } from '../../../shared/components/common/Common.jsx';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme.js';

export const LoginScreen = ({ navigation }) => {
  const { handleLogin, loading, error } = useAuth();
  const [formError, setFormError] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { emailOrUsername: '', password: '' },
  });

  const onSubmit = async (values) => {
    setFormError(null);
    const result = await handleLogin(values);
    if (!result.success) {
      setFormError(result.error);
    }
  };

  const displayError = formError || error;

  return (
    <AuthScreenLayout>
      <Card style={styles.card}>
          <View style={styles.field}>
            <View style={styles.inputRow}>
              <MaterialIcons name="person" size={20} color={COLORS.textLight} style={styles.icon} />
              <Controller
                control={control}
                name="emailOrUsername"
                rules={{ required: 'El correo o usuario es obligatorio' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Correo Institucional"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={styles.inputFlex}
                    inputStyle={styles.inputInner}
                  />
                )}
              />
            </View>
            {errors.emailOrUsername ? (
              <Text style={styles.errorText}>{errors.emailOrUsername.message}</Text>
            ) : null}
          </View>

          <View style={styles.field}>
            <View style={styles.inputRow}>
              <MaterialIcons name="lock" size={20} color={COLORS.textLight} style={styles.icon} />
              <Controller
                control={control}
                name="password"
                rules={{ required: 'La contraseña es obligatoria' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Contraseña"
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={styles.inputFlex}
                    inputStyle={styles.inputInner}
                  />
                )}
              />
            </View>
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            ) : null}
          </View>

          <Pressable
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotLink}
          >
            <Text style={styles.linkText}>Olvidé mi contraseña</Text>
          </Pressable>

          {displayError ? <Text style={styles.errorBanner}>{displayError}</Text> : null}

          <Button
            title="Iniciar Sesión"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.submit}
          />

          <Pressable onPress={() => navigation.navigate('Register')} style={styles.registerRow}>
            <Text style={styles.muted}>¿No tienes cuenta? </Text>
            <Text style={styles.linkText}>Regístrate</Text>
          </Pressable>
        </Card>
    </AuthScreenLayout>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    padding: SPACING.lg,
  },
  field: {
    marginBottom: SPACING.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: SPACING.sm,
    width: 24,
  },
  inputFlex: {
    flex: 1,
    marginBottom: 0,
  },
  inputInner: {
    minHeight: 48,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.md,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  muted: {
    color: COLORS.textLight,
    fontSize: FONT_SIZE.sm,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  submit: {
    marginTop: SPACING.xs,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
  },
  errorBanner: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
});
