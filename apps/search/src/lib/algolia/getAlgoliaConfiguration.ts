import { AuthData } from "@saleor/app-sdk/APL";
import { createDebug } from "../debug";
import { createSettingsManager } from "../metadata";
import { createGraphQLClient } from "@saleor/apps-shared";
import { AppConfigMetadataManager } from "../../modules/configuration/app-config-metadata-manager";
import { createLogger } from "../logger";

interface GetAlgoliaConfigurationArgs {
  authData: AuthData;
}

const logger = createLogger({ name: "getAlgoliaConfiguration" });

export const getAlgoliaConfiguration = async ({ authData }: GetAlgoliaConfigurationArgs) => {
  const client = createGraphQLClient({
    saleorApiUrl: authData.saleorApiUrl,
    token: authData.token,
  });

  const settings = createSettingsManager(client, authData.appId);
  const configManager = new AppConfigMetadataManager(settings);

  try {
    const config = await configManager.get(authData.saleorApiUrl);

    if (config.getConfig()) {
      return {
        settings: config.getConfig(),
      };
    } else {
      return {
        errors: [
          {
            message: "App is not configued. Please configue the app first",
          },
        ],
      };
    }
  } catch (e) {
    logger.error("Failed to fetch configuration from metadata");

    return {
      errors: [
        {
          message: "Failed to load configuration",
        },
      ],
    };
  }
};
