package pl.edu.agh.sogo.web.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;

/**
 * Utility class for HTTP headers creation.
 */
public class HeaderUtil {

    private static final Logger log = LoggerFactory.getLogger(HeaderUtil.class);

    public static HttpHeaders createAlert(String key, String message) {
        log.error("Alert occurred. {}: {}", key, message);

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-SOGO-alert", key);
        headers.add("X-SOGO-message", message);
        return headers;
    }

}
