// client-user/src/features/home/screens/HomeScreen.jsx
import { useCallback, useEffect } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHome } from '../hooks/useHome.js';
import { useAuthStore } from '../../../shared/store/authStore.js';
import { LoadingSpinner, Card } from '../../../shared/components/common/Common.jsx';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../../../shared/constants/theme.js';
import { formatDate, getFileTypeFromUrl, getSubjectName } from '../../../utils/formatters.js';

export const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const { subjects, recentFiles, loading, error, fetchHomeData } = useHome();

  const load = useCallback(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  useEffect(() => {
    load();
  }, [load]);

  const displayName = user?.username || user?.name || 'estudiante';

  const goToDetail = (file) => {
    navigation.navigate('MaterialDetail', { id: file._id || file.id });
  };

  if (loading && subjects.length === 0 && recentFiles.length === 0) {
    return <LoadingSpinner message="Cargando inicio..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + SPACING.md }]}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={COLORS.primary} />}
    >
      <Text style={styles.greeting}>¡Bienvenido de nuevo, {displayName}!</Text>
      <Text style={styles.subtitle}>Explora materiales aprobados de la biblioteca</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mis Asignaturas</Text>
        {subjects.length === 0 ? (
          <Card>
            <Text style={styles.emptyHint}>No hay asignaturas disponibles.</Text>
          </Card>
        ) : (
          <View style={styles.subjectGrid}>
            {subjects.map((subject) => (
              <View key={subject._id || subject.id} style={styles.subjectChip}>
                <MaterialIcons name="menu-book" size={18} color={COLORS.primary} />
                <Text style={styles.subjectName}>{subject.name}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Materiales recientes</Text>
        {recentFiles.length === 0 ? (
          <Card>
            <Text style={styles.emptyHint}>Aún no hay materiales aprobados para mostrar.</Text>
          </Card>
        ) : (
          recentFiles.map((file) => {
            const fileType = getFileTypeFromUrl(file.fileUrl, file.originalName);
            return (
              <Pressable key={file._id || file.id} onPress={() => goToDetail(file)}>
                <Card style={styles.recentCard}>
                  <View style={styles.recentHeader}>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeText}>{fileType}</Text>
                    </View>
                    <Text style={styles.recentDate}>{formatDate(file.createdAt)}</Text>
                  </View>
                  <Text style={styles.recentTitle} numberOfLines={2}>
                    {file.title || file.originalName || 'Sin título'}
                  </Text>
                  <Text style={styles.recentSubject}>{getSubjectName(file)}</Text>
                  <View style={styles.recentFooter}>
                    <Text style={styles.recentLink}>Ver detalle</Text>
                    <MaterialIcons name="chevron-right" size={20} color={COLORS.primary} />
                  </View>
                </Card>
              </Pressable>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  greeting: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textLight,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.lg,
  },
  error: {
    color: COLORS.error,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.md,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  subjectName: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  emptyHint: {
    color: COLORS.textLight,
    fontSize: FONT_SIZE.sm,
  },
  recentCard: {
    marginBottom: SPACING.md,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  typeBadge: {
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  typeText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  recentDate: {
    color: COLORS.textLight,
    fontSize: FONT_SIZE.xs,
  },
  recentTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    marginBottom: 4,
  },
  recentSubject: {
    color: COLORS.textLight,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.sm,
  },
  recentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recentLink: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
});
