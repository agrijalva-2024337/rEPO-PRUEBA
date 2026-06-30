// client-user/src/features/auth/screens/RegisterScreen.jsx
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth.js';
import { AuthScreenLayout } from '../components/AuthScreenLayout.jsx';
import { Button } from '../../../shared/components/common/Button.jsx';
import { Input } from '../../../shared/components/common/Input.jsx';
import { Card } from '../../../shared/components/common/Common.jsx';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme.js';

export const RegisterScreen = ({ navigation }) => {
  const { handleRegister, loading, error } = useAuth();
  const [formError, setFormError] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      surname: '',
      username: '',
      email: '',
      password: '',
      phone: '',
    },
  });

  const onSubmit = async (values) => {
    setFormError(null);
    const result = await handleRegister(values);
    if (result.success) {
      navigation.navigate('Login');
    } else {
      setFormError(result.error);
    }
  };

  const displayError = formError || error;

  return (
    <AuthScreenLayout>
        <Text style={styles.title}>Crear cuenta de estudiante</Text>
        <Text style={styles.subtitle}>
          Completa tus datos para registrarte en la biblioteca
        </Text>

        <Card style={styles.card}>
          <Controller
            control={control}
            name="name"
            rules={{
              required: 'El nombre es obligatorio',
              maxLength: { value: 25, message: 'Máximo 25 caracteres' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nombre"
                placeholder="Nombre"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name.message}</Text> : null}

          <Controller
            control={control}
            name="surname"
            rules={{
              required: 'El apellido es obligatorio',
              maxLength: { value: 25, message: 'Máximo 25 caracteres' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Apellido"
                placeholder="Apellido"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.field}
              />
            )}
          />
          {errors.surname ? (
            <Text style={styles.errorText}>{errors.surname.message}</Text>
          ) : null}

          <Controller
            control={control}
            name="username"
            rules={{ required: 'El usuario es obligatorio' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Usuario"
                placeholder="nombre.usuario"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.field}
              />
            )}
          />
          {errors.username ? (
            <Text style={styles.errorText}>{errors.username.message}</Text>
          ) : null}

          <Controller
            control={control}
            name="email"
            rules={{
              required: 'El correo es obligatorio',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Correo inválido',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Correo institucional"
                placeholder="correo@ejemplo.com"
                autoCapitalize="none"
                keyboardType="email-address"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.field}
              />
            )}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email.message}</Text> : null}

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'La contraseña es obligatoria',
              minLength: { value: 8, message: 'Mínimo 8 caracteres' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Contraseña"
                placeholder="Mínimo 8 caracteres"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.field}
              />
            )}
          />
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          ) : null}

          <Controller
            control={control}
            name="phone"
            rules={{
              required: 'El teléfono es obligatorio',
              validate: (value) => {
                const digits = (value || '').replace(/\D/g, '');
                return digits.length === 8 || 'Debe tener 8 dígitos';
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Teléfono"
                placeholder="8 dígitos"
                keyboardType="phone-pad"
                maxLength={8}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.field}
              />
            )}
          />
          {errors.phone ? <Text style={styles.errorText}>{errors.phone.message}</Text> : null}

          {displayError ? <Text style={styles.errorBanner}>{displayError}</Text> : null}

          <Button
            title="Registrarse"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.submit}
          />

          <Pressable onPress={() => navigation.navigate('Login')} style={styles.backRow}>
            <Text style={styles.muted}>¿Ya tienes cuenta? </Text>
            <Text style={styles.linkText}>Iniciar sesión</Text>
          </Pressable>
        </Card>
    </AuthScreenLayout>
  );
};

const styles = StyleSheet.create({
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textLight,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  field: {
    marginTop: SPACING.md,
  },
  submit: {
    marginTop: SPACING.lg,
  },
  backRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
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
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
  },
  errorBanner: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});
